import React from 'react';
import PropTypes from 'prop-types';
import { MdUndo, MdRedo } from 'react-icons/md';
import {
	Button,
	ButtonGroup,
} from 'reactstrap';

const UndoRedoButton = ({
	className,
	onUndoClick,
	onRedoClick,
	shortcuts,
	undoRedoState,
}) => {
	const rootClassName = `undo-redo-button${className ? ` ${className}` : ''}`;
	return (
		<ButtonGroup className={ rootClassName }>
			<Button disabled={ undoRedoState.previous.length === 0 } outline onClick={ onUndoClick }>
				<MdUndo />
				<small>{`(${shortcuts.UNDO.key})`}</small>
			</Button>
			<Button disabled={ undoRedoState.next.length === 0 } outline onClick={ onRedoClick }>
				<MdRedo />
				<small>{`(${shortcuts.REDO.key})`}</small>
			</Button>
		</ButtonGroup>
	);
};


UndoRedoButton.propTypes = {
	className: PropTypes.string,
	onUndoClick: PropTypes.func,
	onRedoClick: PropTypes.func,
	shortcuts: PropTypes.object,
	undoRedoState: PropTypes.object,
};
UndoRedoButton.defaultProps = {
	className: '',
	onUndoClick: () => {},
	onRedoClick: () => {},
};
export default UndoRedoButton;
