import { withBasicIdentities } from 'shared/models/node/index';

const SHOW = 'Show';
const HIDE = 'Hide';
const SPLIT = 'Split';

const Incident = ({
	id,
	name,
	label,
	x = 0,
	y = 0,
	width = 0,
	height = 0,
	time = '',
	status = SHOW,
}) => {
	const state = {
		x,
		y,
		width,
		height,
		time,
		status,
	};
	return Object.assign(state, withBasicIdentities({ id, name, label }));
};

export {
	Incident, SHOW, HIDE, SPLIT,
};
