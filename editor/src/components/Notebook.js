import '../App.css';
import React from 'react';

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import StickyBox from "react-sticky-box";
import Sidebar from "./Sidebar";
import {Col, Row} from "react-bootstrap";
import CellCollection from "./CellCollection";
import CellType from "./CellType";

class Notebook extends React.Component {

	DEFAULT_NODE = `import java.util.Arrays;
import cnss.simulator.*;
import cnss.lib.*;

public class MinimalNode extends AbstractApplicationAlgorithm {
	public MinimalNode() {
		super(true, "minimal-node");
	}
	
	public int initialise(int now, int node_id, Node self, String[] args) {
		super.initialise(now, node_id, self, args);
	
		super.log( now, "args: " + Arrays.asList(args));
	return 0;
	}
}`;
	DEFAULT_CONFIG = `node 0 0 cnss.lib.EndSystemControl MinimalNode arg1 arg2 
node 1 0 cnss.lib.EndSystemControl MinimalNode arg3 arg4`;

	DEFAULT_MARKDOWN = `Markdown Cell`;

	constructor(props) {
		super(props);
		this.state = {
			cheerpJInfo: {
				packageName: "cheerpJPackage",
				packageCounter: 0
			},
			cells: [
				this.generateCell(CellType.txt, this.DEFAULT_CONFIG, "xml"),
				this.generateCell(CellType.markdown, this.DEFAULT_MARKDOWN),
				this.generateCell(CellType.java, this.DEFAULT_NODE)
			],
			consoleCell: this.generateCell(CellType.console, "", "xml", true, true)
		};
	}

	changeConsoleCellCode(newCode) {
		let newCell = this.state.consoleCell;
		newCell.code = newCode;
		newCell.style.height = this.calculateCellHeight(newCode);
		this.setState({consoleCell: newCell});
	}

	addConsoleCellCode(newCode) {
		let newCell = this.state.consoleCell;
		newCell.code += newCode;
		newCell.style.height = this.calculateCellHeight(newCode);
		this.setState({consoleCell: newCell});
	}

	changeCellCode(i, newCode) {
		let newCells = [...this.state.cells];
		newCells[i].code = newCode;
		if (newCells[i].type == CellType.java)
			newCells[i].className = this.calculateClassName(newCode);
		newCells[i].style.height = this.calculateCellHeight(newCode);
		this.setState({cells: newCells});
	}

	addNewCell(type) {
		let newCell = {};
		switch (type) {
			case "empty":
				newCell = this.generateCell(CellType.java, "");
				break;
			case "minimal-node":
				newCell = this.generateCell(CellType.java, this.DEFAULT_NODE);
				break;
			case "markdown":
				newCell = this.generateCell(CellType.markdown, this.DEFAULT_MARKDOWN);
				break;
		}
		let newCells = [...this.state.cells];
		newCells.push(newCell);
		this.setState({cells: newCells});
	}

	generateCell(type, code, mode, gutter, readOnly) {
		return {
			type: type,
			code: code,
			className: this.calculateClassName(code),
			style: {
				height: this.calculateCellHeight(code),
				gutter: gutter !== undefined ? gutter : true,
				readOnly: readOnly !== undefined ? readOnly : false,
				mode: mode !== undefined ? mode : "java"
			}
		};
	}

	calculateClassName(code) {
		let match = code.match(new RegExp("class" + '\\s(\\w+)'));
		if (match && match.length > 1)
			return match[1];
		else
			return "";
	}

	calculateCellHeight(code) {
		let newLineCount = code.split(/\r\n|\r|\n/).length;
		return 30 + newLineCount * 17;
	}

	incrementCheerpJPackageCounter() {
		let curr = this.state.cheerpJInfo;
		let newInfo = {
			packageName: curr.packageName,
			packageCounter: curr.packageCounter + 1
		};
		this.setState(newInfo);
	}


	render() {
		return (
			<React.Fragment>
				<div style={{display: "flex", alignItems: "flex-start"}}>
					<StickyBox className="side-bar-sticky">
						<Sidebar cells={this.state.cells}
								 cheerpJInfo={this.state.cheerpJInfo}
								 addNewCell={(type) => this.addNewCell(type)}
								 changeConsoleCellCode={(newCode) => this.changeConsoleCellCode(newCode)}
								 addConsoleCellCode={(newCode) => this.addConsoleCellCode(newCode)}
								 incrementCheerpJPackageCounter={() => this.incrementCheerpJPackageCounter()}
						/>
					</StickyBox>
					<div>
						<br/>
						<div className="container-fluid no-padding">
							<Row className="full-row">
								<Col className='col-sm-3'>

								</Col>
								<Col className='col-sm-9'>
									<CellCollection cells={this.state.cells}
													changeCellCode={(i, newCode) => this.changeCellCode(i, newCode)}
													consoleCell={this.state.consoleCell}
									/>
								</Col>
							</Row>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default Notebook;
