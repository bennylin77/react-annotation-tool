import { getI18nextInstance } from 'shared/utils/i18nextUtils';

const resources = {
	en: {
		twoDimensionalImage: {
			magnifierOff: 'Off',
			magnifierPower: 'Power',
			optionNotSelected: 'Not selected',
		},
	},
};

export default getI18nextInstance({ ns: 'twoDimensionalImage', resources });
