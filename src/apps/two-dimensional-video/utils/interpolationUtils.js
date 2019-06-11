import { getLinearInterpolatedValue } from 'shared/utils/mathUtils';

const INTERPOLATION_TYPE = {
	LENGTH: 'LENG',
	POSITION: 'POS',
};

const getInterpolatedData = ({
	startIncident, endIncident, currentTime, type,
}) => {
	const interpolated = {};
	switch (type) {
	case INTERPOLATION_TYPE.LENGTH:
		interpolated.width = getLinearInterpolatedValue(endIncident.time, startIncident.time, endIncident.width, startIncident.width, currentTime);
		interpolated.height = getLinearInterpolatedValue(endIncident.time, startIncident.time, endIncident.height, startIncident.height, currentTime);
		break;
	case INTERPOLATION_TYPE.POSITION:
		interpolated.x = getLinearInterpolatedValue(endIncident.time, startIncident.time, endIncident.x, startIncident.x, currentTime);
		interpolated.y = getLinearInterpolatedValue(endIncident.time, startIncident.time, endIncident.y, startIncident.y, currentTime);
		break;
	default:
		break;
	}
	return interpolated;
};

export { getInterpolatedData, INTERPOLATION_TYPE };
