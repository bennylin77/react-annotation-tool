import { withBasicIdentities } from 'shared/models/node/index';

const Polygon = ({
	id,
	name,
	color,
	closed = false,
	vertices = [],
	selected = [],
}) => {
	const state = {
		color,
		closed,
		vertices,
		selected,
	};
	return Object.assign(state, withBasicIdentities({ id, name }));
};

export {
	Polygon,
};
