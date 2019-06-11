import { withBasicIdentities } from 'shared/models/node/index';

const rectangle = ({
	id,
	name,
	label,
	color,
	isManipulatable = true,
	incidents = [],
	childrenNames = [],
	parentName = '',
}) => {
	const state = {
		color,
		isManipulatable,
		incidents,
		childrenNames,
		parentName,
	};
	return Object.assign(state, withBasicIdentities({ id, name, label }));
};

export {
	rectangle,
};
