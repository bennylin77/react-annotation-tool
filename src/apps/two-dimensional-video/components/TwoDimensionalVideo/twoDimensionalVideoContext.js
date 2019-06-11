import React from 'react';

const TwoDimensionalVideoContext = React.createContext({
	entities: { annotations: {} },
	annotations: [],
	duration: 0,
	played: 0,
	focusing: '',
	height: 0,
	isEmptyCheckEnable: false,
	onAnnotationItemClick: () => {},
	onAnnotationDeleteClick: () => {},
	onIncidentItemClick: () => {},
	onIncidentItemDeleteClick: () => {},
});

export default TwoDimensionalVideoContext;
