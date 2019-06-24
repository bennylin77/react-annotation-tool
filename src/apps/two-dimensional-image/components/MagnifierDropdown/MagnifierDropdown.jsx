import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';
import { GoSearch } from 'react-icons/go';
import './magnifierDropdown.scss';

const MagnifierDropdown = ({
	className,
	size,
	power,
	shortcuts,
	handleChange,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const { t } = useTranslation('twoDimensionalImage');
	const rootClassName = `magnifier-dropdown${className ? ` ${className}` : ''}`;

	return (
		<Dropdown className={ rootClassName } isOpen={ isOpen } toggle={ () => setIsOpen(!isOpen) } size={ size }>
			<DropdownToggle className='magnifier-dropdown__toggle d-flex align-items-center' color='link' caret>
				<GoSearch className='pr-1' />
				{power > 1 ? `${power}X` : t('magnifierOff') }
			</DropdownToggle>
			<DropdownMenu>
				<DropdownItem header>{t('magnifierPower')}</DropdownItem>
				<DropdownItem className='magnifier-dropdown__item' onClick={ () => handleChange(1) }>
					{t('magnifierOff')}
					<small>
						{`(${shortcuts['1X'].key})`}
					</small>
				</DropdownItem>
				<DropdownItem className='magnifier-dropdown__item' onClick={ () => handleChange(2) }>
					{'2X'}
					<small>
						{`(${shortcuts['2X'].key})`}
					</small>
				</DropdownItem>
				<DropdownItem className='magnifier-dropdown__item' onClick={ () => handleChange(3) }>
					{'3X'}
					<small>
						{`(${shortcuts['3X'].key})`}
					</small>
				</DropdownItem>
				<DropdownItem className='magnifier-dropdown__item' onClick={ () => handleChange(4) }>
					{'4X'}
					<small>
						{`(${shortcuts['4X'].key})`}
					</small>
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};


MagnifierDropdown.propTypes = {
	className: PropTypes.string,
	size: PropTypes.string,
	power: PropTypes.number,
	shortcuts: PropTypes.object,
	handleChange: PropTypes.func,
};
MagnifierDropdown.defaultProps = {
	className: '',
	size: 'md',
	power: 1,
	shortcuts: [],
	handleChange: () => {},
};
export default MagnifierDropdown;
