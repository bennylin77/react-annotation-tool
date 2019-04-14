const getRandomInt = (max = 0) => Math.floor(Math.random() * Math.floor(max));
const getLinearInterpolatedValue = ({
    x0, x1, y0, y1, x,
}) => {
    const slope = (y1 - y0) / (x1 - x0);
    return slope * (x - x0) + y0;
};

export {
    getRandomInt,
    getLinearInterpolatedValue,
};
