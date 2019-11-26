import React, { useState, } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import './style.scss';

const PREFIX_CLASS = 'date-picker';

const propTypes = {
	className: PropTypes.string,
};
const MonthEnums = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',];
const CALENDAR_MODE = {
	DATE: 'date',
	MONTH: 'month',
	YEAR: 'year',
};
const {
	DATE,
	MONTH,
	YEAR,
} = CALENDAR_MODE;

function DatePicker({
	className,
}) {
	const today = new Date();
	const [year, setYear] = useState(today.getFullYear());
	const [month, setMonth] = useState(today.getMonth());
	const [date, setDate] = useState(today.getDate());
	const [calendarVisible, setCalendarVisable] = useState(true);
	const [mode, setMode] = useState(DATE);
	const calendarMode = {
		[DATE]: {
			optionsClick: changeMonth,
			header: `${MonthEnums[month]} ${year}`,
			body: '',
		},
		[MONTH]: {
			optionsClick: changeYear,
			header: `${year}`,
			body: '',
		},
		[YEAR]: {
			optionsClick: () => {},
			header: `year Range`,
			body: '',
		},
	};

	function changeMode() {
		switch (mode) {
			case DATE: {
				setMode(MONTH);
				break;
			}
			case MONTH: {
				setMode(YEAR);
				break;
			}
			case YEAR: {
				setMode(DATE);
				break;
			}
			default: {
				setMode(DATE);
			}
		}
	}
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
	function changeYear(event) {
		setYear(year + event);
	}
	function changeYearRange(event) {

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
					<span onClick={() => {calendarMode[mode].optionsClick(-1);}}> &lt; </span>
					<div onClick={changeMode}>
						{calendarMode[mode].header}
					</div>
					<span onClick={() => {calendarMode[mode].optionsClick(1);}}> &gt; </span>
				</div>
				<div className={`${PREFIX_CLASS}__calendar-body`}>改變的區塊</div>
			</div>
		</div>
	);
}

DatePicker.propTypes = propTypes;

export default DatePicker;
