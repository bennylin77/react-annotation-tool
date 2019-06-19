import i18next from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const getI18nextInstance = ({ ns = 'translation', resources }) => {
	const newInstance = i18next.createInstance();
	newInstance
		.use(languageDetector)
		.use(initReactI18next)
		.init({
			fallbackLng: 'en',
			ns,
			resources,
			keySeparator: false,
			interpolation: {
				escapeValue: false,
			},
		});
	return newInstance;
};

/*
const setI18n = ({ lng = 'en', ns = 'translation', resources }) => {
	if (i18n.isInitialized) {
		i18n.addResourceBundle(lng, ns, resources, true, true);
		console.log(1)
		console.log(ns)
	} else {
		i18n
			.use(languageDetector)
			.use(initReactI18next)
			.init({
				fallbackLng: 'en',
				ns: ns,
				resources,
				keySeparator: false,
				interpolation: {
					escapeValue: false,
				},
			});
	}
	console.log(i18n.hasResourceBundle(lng, ns))
	return i18n;
};
*/
export {
	getI18nextInstance,
};
