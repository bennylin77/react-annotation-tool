const isDialogDisabledConst = {
	SHOW: 'show',
	HIDE: 'hide',
	DELETE: 'delete',
	SPLIT: 'split',
};
const initialIsDialogDisabledState = {
	delete: false,
	show: false,
	hide: false,
	split: false,
};
const isDialogDisabledReducer = (state, action) => {
	switch (action.type) {
	case isDialogDisabledConst.SHOW:
		return { show: action.value };
	case isDialogDisabledConst.HIDE:
		return { hide: action.value };
	case isDialogDisabledConst.DELETE:
		return { delete: action.value };
	case isDialogDisabledConst.SPLIT:
		return { split: action.value };
	default:
		throw new Error();
	}
};

export {
	isDialogDisabledConst,
	initialIsDialogDisabledState,
	isDialogDisabledReducer,
};
