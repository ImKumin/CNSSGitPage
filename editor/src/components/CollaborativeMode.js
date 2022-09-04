import {Convergence} from "@convergence/convergence";
import CellTypeEnum from "./CellTypeEnum";

const CONVERGENCE_URL = "http://localhost:8000/api/realtime/convergence/default";

class CollaborativeMode {
	constructor(notebookState) {
		this.notebookState = notebookState;
		this.convergenceOberserver = null;
		this.aceRange = window.ace.require("ace/range").Range;

		//this.colorAssigner = new ConvergenceColorAssigner.ColorAssigner();

		this.editors = [];
		this.sessions = [];
		this.docs = [];

		this.suppressEvents = [];

		this.initColabMode();
	}

	initColabMode() {
		let thisState = this;
		console.log("Initiating collaborative mode.");
		Convergence.connectAnonymously(CONVERGENCE_URL)
			.then((d) => {
				let domain = d;
				return domain.models().openAutoCreate({
					collection: "WEB-BASED-CNSS-COLLECTION",
					id: "WEB-BASED-CNSS",
					ephemeral: true,
					data: {
						notebook: thisState.notebookState.state
					}
				});
			})
			.then((model) => {
				this.handleOpen(model, thisState);
			})
			.catch(error => {
				console.error("Could not open model ", error);
			});
	}

	handleOpen(model, thisState) {
		thisState.convergenceOberserver = model.root();
		const notebook = model.elementAt("notebook").value();
		if (notebook)
			thisState.notebookState.setState(notebook);
		console.log(notebook);
		for (let i in notebook.cells) {
			switch (notebook.cells[i].type) {
				case CellTypeEnum.java:
					this.setupAceModel(model, thisState, notebook, i);
					break;
				case CellTypeEnum.txt:
					this.setupAceModel(model, thisState, notebook, i);
					break;
				case CellTypeEnum.console:
					this.setupAceModel(model, thisState, notebook, i);
					break;
				case CellTypeEnum.markdown:
					this.setupEasyMarkdownModel(model, thisState, notebook, i);
					break;
				default:
					break;
			}
		}
	}

	setupAceModel(model, thisState, notebook, i) {
		thisState.editors[i] = window.ace.edit(notebook.cells[i].name);
		thisState.sessions[i] = thisState.editors[i].getSession();
		thisState.docs[i] = thisState.sessions[i].getDocument();
		thisState.suppressEvents[i] = false;

		const textModel = model.elementAt(["notebook", "cells", i, "code"]);
		this.initAceModel(textModel, thisState, i);
	}

	initAceModel(textModel, thisState, i) {
		const session = thisState.editors[i].getSession();
		session.setValue(textModel.value());

		textModel.on("insert", (e) => {
			const pos = thisState.docs[i].indexToPosition(e.index);
			thisState.suppressEvents[i] = true;
			thisState.docs[i].insert(pos, e.value);
			thisState.suppressEvents[i] = false;
		});

		textModel.on("remove", (e) => {
			const start = thisState.docs[i].indexToPosition(e.index);
			const end = thisState.docs[i].indexToPosition(e.index + e.value.length);
			thisState.suppressEvents[i] = true;
			thisState.docs[i].remove(new window.ace.Range(start.row, start.column, end.row, end.column));
			thisState.suppressEvents[i] = false;
		});

		textModel.on("value", function (e) {
			thisState.suppressEvents[i] = true;
			thisState.docs[i].setValue(e.value);
			thisState.suppressEvents[i] = false;
		});

		thisState.editors[i].on('change', (delta) => {
			if (thisState.suppressEvents[i]) {
				return;
			}
			const pos = thisState.docs[i].positionToIndex(delta.start);
			switch (delta.action) {
				case "insert":
					textModel.insert(pos, delta.lines.join("\n"));
					break;
				case "remove":
					textModel.remove(pos, delta.lines.join("\n").length);
					break;
				default:
					throw new Error("Unknown action: " + delta.action);
			}
		});
	}

	setupEasyMarkdownModel(model, thisState, notebook, i) {

	}
}

export default CollaborativeMode;
