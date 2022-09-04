import React from 'react';
import {ProSidebar, Menu, MenuItem, SubMenu, SidebarFooter, SidebarContent} from 'react-pro-sidebar';
import '../custom.scss';
import CompilerAndWorkerManager from "./CompilerAndWorkerManager";
import UploadFiles from "./UploadFiles";

function Sidebar(props) {
	function renderOtherFiles(file, index) {
		return <React.Fragment key={index}>
			<div>{file.name + " - " + file.content.byteLength + " bytes"}</div>
		</React.Fragment>;
	}

	return (
		<ProSidebar>
			<SidebarContent>
				<div className="side-bar-content">
					<Menu iconShape="square">
						<SubMenu title="Add Cell">
							<MenuItem onClick={() => props.addNewCell("markdown")}>Add Markdown Cell</MenuItem>
							<MenuItem onClick={() => props.addNewCell("empty")}>Add Java Empty Cell</MenuItem>
							<MenuItem onClick={() => props.addNewCell("minimal-node")}>Add Minimal Node</MenuItem>
							<MenuItem onClick={() => props.addNewCell("periodic-node")}>Add Periodic Action
								Node</MenuItem>
						</SubMenu>
						<MenuItem onClick={() => props.openModal("import")}>Import Project</MenuItem>
						<MenuItem onClick={() => props.openModal("export")}>Export Project</MenuItem>
						<MenuItem onClick={() => props.deleteAll()}>Reset Project</MenuItem>
						<MenuItem>
							<UploadFiles addNewCell={(type, code) => props.addNewCell(type, code)}
										 addFile={(name, type, content, size) => props.addFile(name, type, content, size)}
							/>
						</MenuItem>
						<MenuItem>
							Files loaded:
							<p/>
							{props.otherFiles.map((item, index) => {
								return renderOtherFiles(item, index);
							})}
						</MenuItem>
					</Menu>
				</div>
			</SidebarContent>
			<SidebarFooter>
				<div className="side-bar-footer">
					<CompilerAndWorkerManager cells={props.cells}
											  otherFiles={props.otherFiles}
											  changeConsoleCellCode={(newCode) => props.changeConsoleCellCode(newCode)}
											  addConsoleCellCode={(newCode) => props.addConsoleCellCode(newCode)}
					/>
				</div>
			</SidebarFooter>
		</ProSidebar>
	);
}

export default Sidebar;
