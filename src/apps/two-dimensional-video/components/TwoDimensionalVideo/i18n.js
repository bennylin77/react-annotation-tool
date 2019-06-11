import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
	en: {
		translation: {
			addingBox: 'Adding a New Box',
			addBox: 'Add a New Box',
			incidentStatus: '<0>{{status}}</0> at <1/>',
			incidentSize: '<0>Size</0> <1/>x<2/>',
			incidentPosition: '<0>Position</0> <1/>, <2/>',
			dialogTitleDelete: 'Delete this annotation',
			dialogTitleShow: 'Show this annotation',
			dialogTitleHide: 'Hide this annotation',
			dialogTitleSplit: 'Split this box',
			dialogMessageDelete: 'Does the object show up on the video and would you like to show its annotation?',
			dialogMessageShow: 'Does the object show up on the video and would you like to show its annotation?',
			dialogMessageHide: 'Does the object leave the video or is obscured by other objects and would you like to hide its annotation?',
			dialogMessageSplit: 'Does the object split into two and would you like to split this bounding box into two boxes?',
			AnnotationListEmptyHint: 'Click the button above to begin tracking a new cell',
			AnnotationItemParent: 'Parent',
			AnnotationItemChildren: 'Children',
			AnnotationItemIncidentHistory: 'Resizing & Tracking History',
		},
	},
};

i18n
	.use(initReactI18next)
	.init({
		resources,
		lng: 'en',
		keySeparator: false,
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
