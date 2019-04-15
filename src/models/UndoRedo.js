export class UndoRedo {
	constructor(state) {
		this.previous = [];
		this.next = [];
	}

	save = (state) => {
		// console.log(state)
		const clonedState = JSON.parse(JSON.stringify(state));
		// console.log(clonedState)
		this.previous.push(clonedState);
		this.next = [];
	}

	undo = (state) => {
		this.next.push(state);
		return this.previous.pop();
	}

	redo = (state) => {
		this.previous.push(state);
		return this.next.pop();
	}
}
