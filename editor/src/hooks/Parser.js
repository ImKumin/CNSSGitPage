	const CREATED_NODE_STRING = "Created Node";
const DROPPED_PACKET_STRING = "DROPPED";
const NORMAL_PACKET_STRING = "PACKET";

class Parser {
	constructor(options) {
		this.nodeNameWithType = options ? options.nodeNameWithType ? options.nodeNameWithType : true : true;
	}

	parseOutput(output) {
		let parsedOutput = {
			nodes: [],
			messages: []
		};
		const lines = output.split('\n');
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (line.includes(CREATED_NODE_STRING)) {
				parsedOutput.nodes.push(this.parseNewNode(line));
			} else if (line.includes(DROPPED_PACKET_STRING))
				parsedOutput.messages.push(this.parseNewMessage(line, true));
			else if (line.includes(NORMAL_PACKET_STRING))
				parsedOutput.messages.push(this.parseNewMessage(line, false));
		}
		return parsedOutput;
	}

	parseNewNode(line) {
		let nodeInfo = {
			nodeName: "",
			nodeNumber: "-1",
			nodeType: ""
		};
		let nodeNumber = line.match(new RegExp(`Created Node ([\\s\\S]*?):`));
		if (nodeNumber && nodeNumber.length > 1)
			nodeInfo.nodeNumber = nodeNumber[1];

		let nodeType = line.match(new RegExp(`app code:\\s(\\w+)`));
		if (nodeType && nodeType.length > 1)
			nodeInfo.nodeType = nodeType[1];

		nodeInfo.nodeName = `Node ${nodeInfo.nodeNumber} ${this.nodeNameWithType ? "(" + nodeInfo.nodeType + ")" : ""}`;
		return nodeInfo;
	}

	parseNewMessage(line, dropped) {
		let messageInfo = {
			dropped: dropped,
			fromNode: line.match(new RegExp(`src\\s(\\w+)`))[1],
			toNode: line.match(new RegExp(`dst\\s(\\w+)`))[1],
			type: line.match(new RegExp(`type\\s(\\w+)`))[1],
			ttl: parseInt(line.match(new RegExp(`ttl\\s(\\w+)`))[1]),
			seq: parseInt(line.match(new RegExp(`seq\\s(\\w+)`))[1]),
			size: parseInt(line.match(new RegExp(`size\\s(\\w+)`))[1]),
			time: parseInt(line.match(new RegExp(`time\\s(\\w+)`))[1]),
			deliveryTime: dropped ? parseInt(line.match(new RegExp(`time\\s(\\w+)`))[1]) + 20 : parseInt(line.match(new RegExp(`delivery\\s(\\w+)`))[1])
		};

		return messageInfo;
	}
}

export default Parser;