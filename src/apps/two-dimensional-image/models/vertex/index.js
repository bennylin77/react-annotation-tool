import { withBasicIdentities } from 'shared/models/node/index';

const Vertex = ({
	id,
	name,
	x,
	y,
}) => {
	const state = {
		x,
		y,
	};
	return Object.assign(state, withBasicIdentities({ id, name }));
};

export {
	Vertex,
};
