import '../App.css';
import React, {useMemo} from 'react';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import SimpleMdeReact from "react-simplemde-editor";
import "../Easymde.min.css";
import CellType from "./CellTypeEnum";
import {Button} from "react-bootstrap";

function Cell(props) {
	const toolbarSettings = ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "|", "guide"];

	const markdownOptions = useMemo(() => {
		return {
			autofocus: false,
			spellChecker: false,
			status: false,
			toolbar: toolbarSettings,
			tabSize: 8
		}
	}, [props.cellInfo.markdown.focused]);

	const customEvents = useMemo(() => {
		return {
			focus: props.onFocusMarkdown,
			blur: props.onBlurMarkdown
		};
	}, [props.onBlurMarkdown, props.onFocusMarkdown]);

	function onChange(newValue) {
		props.onChange(newValue);
	}

	function renderMarkdownCell() {
		return <SimpleMdeReact value={props.cellInfo.code}
							   onChange={onChange}
							   options={markdownOptions}
		/>;
	}

	function renderCodeCell() {
		return <AceEditor
			id={"aceEditor"}
			height={props.cellInfo.style.height}
			width={1020}
			placeholder=""
			mode={props.cellInfo.style.mode}
			theme="monokai"
			name={props.cellInfo.name}
			onChange={onChange}
			fontSize={14}
			showPrintMargin={false}
			showGutter={props.cellInfo.style.gutter}
			highlightActiveLine={false}
			readOnly={props.cellInfo.style.readOnly}
			value={props.cellInfo.code}
			cursorStart={0}
			setOptions={{
				enableBasicAutocompletion: true,
				enableLiveAutocompletion: true,
				enableSnippets: true,
				showLineNumbers: true,
				tabSize: 4,
			}}/>
	}

	function renderButtons() {
		if (props.cellInfo.type !== CellType.console && props.cellInfo.type !== CellType.txt)
			return <div className="cell-info">
				<Button className="cell-button" onClick={() => props.moveCellUp()}>↑</Button>
				&nbsp;&nbsp;
				<Button className="cell-button" onClick={() => props.moveCellDown()}>↓</Button>
				&nbsp;&nbsp;
				<Button className="cell-button" onClick={() => props.deleteCell()}>❌</Button>
			</div>;
	}

	function render() {
		if (props.cellInfo.type === CellType.markdown)
			return renderMarkdownCell();
		return renderCodeCell();
	}

	return <React.Fragment>
		<div className="cell-border">
			{renderButtons()}
			{render()}
		</div>
		<br/>
	</React.Fragment>;
}

export default Cell;
