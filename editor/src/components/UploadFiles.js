import '../App.css';
import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone'
import CellTypeEnum from "./CellTypeEnum";

function UploadFiles(props) {
	const onDrop = useCallback((acceptedFiles) => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onabort = () => console.log('File reading was aborted.');
			reader.onerror = () => console.log('File reading has failed.');
			reader.onload = () => {
				let fileType = file.name.split('.').pop();
				const binaryStr = reader.result;
				let enc = new TextDecoder("utf-8");
				switch (fileType) {
					case "jpg":
						props.addFile(file.name, CellTypeEnum.image, binaryStr, file.size);
						break;
					case "java":
						props.addNewCell("java-node", enc.decode(binaryStr));
						break;
					case "txt":
						props.addNewCell("markdown-node", enc.decode(binaryStr));
						break;
					default:
						props.addNewCell("java-node", enc.decode(binaryStr));
						break;
				}
			};
			reader.readAsArrayBuffer(file);
		})

	}, [props]);
	const {getRootProps, getInputProps} = useDropzone({onDrop});

	return (
		<React.Fragment>
			<div {...getRootProps()} className={"drag-drop-div"}>
				<input {...getInputProps()} />
				Drag To
				<br/>
				Upload Files
			</div>
		</React.Fragment>
	)
}

export default UploadFiles;
