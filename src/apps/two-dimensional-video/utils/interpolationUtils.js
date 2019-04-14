import { getLinearInterpolatedValue } from 'shared/utils/mathUtils';

const INTERPOLATION_TYPE = {
    LENGTH: 'LENG',
    POSITION: 'POS',
};

const getInterpolatedData = ({
    startEvent, endEvent, currentTime, type,
}) => {
    const interpolated = {};
    switch (type) {
        case INTERPOLATION_TYPE.LENGTH:
            interpolated.width = getLinearInterpolatedValue(endEvent.time, startEvent.time, endEvent.width, startEvent.width, currentTime);
            interpolated.height = getLinearInterpolatedValue(endEvent.time, startEvent.time, endEvent.height, startEvent.height, currentTime);
            break;
        case INTERPOLATION_TYPE.POSITION:
            interpolated.x = getLinearInterpolatedValue(endEvent.time, startEvent.time, endEvent.x, startEvent.x, currentTime);
            interpolated.y = getLinearInterpolatedValue(endEvent.time, startEvent.time, endEvent.y, startEvent.y, currentTime);
            break;
        default:
            break;
    }
    return interpolated;
};

export { getInterpolatedData, INTERPOLATION_TYPE };
