import { withBasicIdentities } from 'shared/models/node/index';

const Polygon = ({
	id,
	name,
	color,
	isClosed = false,
	vertices = [],
	selectedOptions = [],
}) => {
	const state = {
		color,
		isClosed,
		vertices,
		selectedOptions,
	};
	return Object.assign(state, withBasicIdentities({ id, name }));
};

export {
	Polygon,
};
