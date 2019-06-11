import { withBasicIdentities } from 'shared/models/node/index';

const canClearRedundantIncidents = state => ({
	clearRedundantIncidents: (status) => {
		const { incidents } = state;
		for (let i = incidents.length - 1; i > 0; i -= 1) {
			if (incidents[i].status === status && incidents[i].status === incidents[i - 1].status) {
				incidents.splice(i, 1);
			}
		}
	},
});

const Rectangle = ({
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
	return Object.assign(state, withBasicIdentities({ id, name, label }), canClearRedundantIncidents(state));
};

export {
	Rectangle,
};
