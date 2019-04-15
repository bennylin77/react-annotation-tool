export class VideoAnnotation {
	constructor({
		id, name, label, color, isManipulatable = true, trajectories, children = [], parent = '',
	}) {
		this.id = id;
		this.name = name;
		this.label = label;
		this.color = color;
		this.isManipulatable = isManipulatable;
		this.trajectories = trajectories;
		this.children = children;
		this.parent = parent;
	}
}
export class Trajectory {
	constructor({
		id, name, x, y, width, height, time, status = SHOW,
	}) {
		this.id = id;
		this.name = name;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.time = time;
		this.status = status;
	}

	static clearRedundantTrajectories(trajectories, status) {
	  for (let i = trajectories.length - 1; i > 0; i--) {
	     if (trajectories[i].status === status && trajectories[i].status === trajectories[i - 1].status) {
	        trajectories.splice(i, 1);
	     }
	  }
	}
}

export const SHOW = 'Show';
export const HIDE = 'Hide';
export const SPLIT = 'Split';
