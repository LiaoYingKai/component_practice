import React, { useState, } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import './style.scss';

const PREFIX_CLASS = 'date-picker';

const propTypes = {
	className: PropTypes.string,
};
const MONTH = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',];

function DatePicker({
	className,
}) {
	const today = new Date();
	const [year, setYear] = useState(today.getFullYear());
	const [month, setMonth] = useState(today.getMonth());
	const [date, setDate] = useState(today.getDate());

	const [calendarVisible, setCalendarVisable] = useState(true);
	
	function changeMonth(event) {
		if (month + event === 12) {
			setYear(year + 1);
			setMonth(0);
		} else if (month + event === -1) {
			setYear(year - 1);
			setMonth(11);
		} else {
			setMonth(month + event);
		}
	}

	return (
		<div className={cx(PREFIX_CLASS, className)}>
			<input 
				defaultValue={today}
				onClick={() => {setCalendarVisable(true);}}
				onBlur={() => {setCalendarVisable(false);}}
			></input>
			<div className={cx(
				`${PREFIX_CLASS}__calendar`,
				{ [`${PREFIX_CLASS}__calendar--visible`]: calendarVisible }
			)}>
				<div className={`${PREFIX_CLASS}__calendar-header`}>
					<span onClick={() => {changeMonth(-1);}}> &lt; </span>
					<div>
						{MONTH[month]} {year}
					</div>
					<span onClick={() => {changeMonth(1);}}> &gt; </span>
				</div>
				<div className={`${PREFIX_CLASS}__calendar-body`}>改變的區塊</div>
			</div>
		</div>
	);
}

DatePicker.propTypes = propTypes;

export default DatePicker;
