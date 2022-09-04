import '../App.css';
import React from 'react';
import {Button} from "react-bootstrap";

class Graphics extends React.Component {
	constructor(props) {
		super(props);
		this.canvasWidth = 1070;
		this.canvasHeight = 1000;
		this.canvasRef = React.createRef();
		this.nodes = {};
		this.output = {};
	}

	storeOutput(parsedOutput) {
		console.log(parsedOutput);
		this.output = parsedOutput;
	}

	drawCanvas() {
		const canvas = this.canvasRef.current;
		const context = canvas.getContext('2d');
		context.fillStyle = '#1f1f1b';
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);

		this.drawNodes(this.output.nodes);
		this.drawMessages(this.output.messages);
	}

	drawNodes(nodesObj) {
		let space = this.canvasWidth / nodesObj.length;
		for (let i = 0; i < nodesObj.length; i++) {
			let pos = space / 2 + space * i;
			this.nodes[i] = {name: nodesObj[i].nodeName, pos: pos};
			this.drawNode(this.nodes[i]);
		}
	}

	drawNode(node) {
		const canvas = this.canvasRef.current;
		const context = canvas.getContext('2d');
		context.beginPath();
		context.strokeStyle = 'white';
		context.lineWidth = 1;
		context.font = '14px arial';
		context.strokeText(node.name, node.pos - context.measureText(node.name).width / 2, 40);

		context.strokeStyle = 'white';
		context.lineWidth = 1;
		context.beginPath();
		context.moveTo(node.pos, 50);
		context.lineTo(node.pos, this.canvasHeight - 50);
		context.stroke();
		context.closePath();
	}

	drawMessages(messagesObj) {
		let scale = this.calculateScale(messagesObj);
		for (let i in messagesObj) {
			let m = messagesObj[i];
			this.drawMessage(m.fromNode, m.toNode, m.time, m.deliveryTime, m.dropped, scale);
		}
	}

	drawMessage(node, destNode, clock, destClock, dropped, scale) {
		let fromX = this.nodes[node].pos;
		let toX = dropped ? (this.nodes[node].pos + this.nodes[destNode].pos) / 2 : this.nodes[destNode].pos;
		let fromY = 75 + clock * scale;
		let toY = 75 + destClock * scale;
		let headLength = 10;
		let dx = toX - fromX;
		let dy = toY - fromY;
		let angle = Math.atan2(dy, dx);

		const canvas = this.canvasRef.current;
		const context = canvas.getContext('2d');
		context.beginPath();
		context.strokeStyle = 'white';
		if (dropped)
			context.strokeStyle = 'red';
		context.moveTo(fromX, fromY);
		context.lineTo(toX, toY);
		context.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
		context.moveTo(toX, toY);
		context.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
		context.stroke();
		context.closePath();
	}

	calculateScale(messagesObj) {
		let maxTime = messagesObj[messagesObj.length - 1].time + 20;
		let minTime = messagesObj[0].time;
		return (this.canvasHeight - 175) / (maxTime - minTime);
	}

	degToRad(degrees) {
		return degrees * Math.PI / 180;
	}

	render() {
		if (Object.keys(this.output).length === 0)
			return;
		return <React.Fragment>
			<Button className="justify-content-center" onClick={() => {
				this.drawCanvas()
			}}>Draw Nodes and Messages From Output</Button>
			<p/>
			<canvas ref={this.canvasRef} width={this.canvasWidth} height={this.canvasHeight}/>
		</React.Fragment>;
	}
}

export default Graphics;
