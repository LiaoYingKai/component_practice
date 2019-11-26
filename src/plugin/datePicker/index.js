import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import './style.scss';

const PREFIX_CLASS = 'date-picker';

const propTypes = {
	className: PropTypes.string,
};
const MonthEnums = {
	1: {
		month: 'Jan',
		days: 31,
		jsMonth: 0,
	},
	2: {
		month: 'Feb',
		days: 28,
		jsMonth: 1,
	},
	3: {
		month: 'Mar',
		days: 31,
		jsMonth: 2,
	},
	4: {
		month: 'Apr',
		days: 30,
		jsMonth: 3,
	},
	5: {
		month: 'May',
		days: 31,
		jsMonth: 4,
	},
	6: {
		month: 'Jun',
		days: 30,
		jsMonth: 5,
	},
	7: {
		month: 'Jul',
		days: 31,
		jsMonth: 6,
	},
	8: {
		month: 'Aug',
		days: 31,
		jsMonth: 7,
	},
	9: {
		month: 'Sep',
		days: 30,
		jsMonth: 8,
	},
	10: {
		month: 'Oct',
		days: 31,
		jsMonth: 9,
	},
	11: {
		month: 'Nov',
		days: 30,
		jsMonth: 10,
	},
	12: {
		month: 'Dec',
		days: 31,
		jsMonth: 11,
	},
};
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
	const [month, setMonth] = useState(today.getMonth() + 1);
	const [date, setDate] = useState(today.getDate());
	const [calendarVisible, setCalendarVisable] = useState(true);
	const [mode, setMode] = useState(DATE);
	// const [bodyArray, setBodyArray] = useState([]);
	const calendarMode = {
		[DATE]: {
			optionsClick: changeMonth,
			header: `${MonthEnums[month].month} ${year}`,
			body: _renderDate(),
		},
		[MONTH]: {
			optionsClick: changeYear,
			header: `${year}`,
			body: _renderMonth(),
		},
		[YEAR]: {
			optionsClick: changeYearRange,
			header: `year Range`,
			body: _renderYear(),
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
		if (month + event === 13) {
			setYear(year + 1);
			setMonth(1);
		} else if (month + event === 0) {
			setYear(year - 1);
			setMonth(12);
		} else {
			setMonth(month + event);
		}
	}
	function changeYear(event) {
		setYear(year + event);
	}
	function changeYearRange(event) {

	}

	function _renderDate() {
		// TODO 處理潤月的問題
		const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
		let nextYear = year;
		let prevYear = year;
		let prevMonth = month;
		let nextMonth = month;
		if (prevMonth - 1 === 0) {
			prevMonth = 12;
			prevYear = prevYear - 1;
		} else {
			prevMonth = prevMonth - 1;
		}
		if (nextMonth + 1 > 12) {
			nextMonth = 1;
			nextYear = nextYear + 1;
		} else {
			nextMonth = nextMonth + 1;
		}
		let prevMonthLastDate = MonthEnums[prevMonth].days;
		let nextMonthFirstDate = 1;
		const calendarArray = [];

		do {
			calendarArray.unshift(<div className={`${PREFIX_CLASS}__calendar-body--date-disable`}>{prevMonthLastDate}</div>);
			prevMonthLastDate--;
		} while (new Date(`${prevYear}/${prevMonth}/${prevMonthLastDate}`).getDay() != 6);

		for (let i = 1; i <= MonthEnums[month].days; i++) {
			let className = '';
			if (i === date) {
				className = `${PREFIX_CLASS}__calendar-body--date-this-month ${PREFIX_CLASS}__calendar-body--date-selected`
			} else {
				className = `${PREFIX_CLASS}__calendar-body--date-this-month`;
			}
			calendarArray.push(<div className={className}>{i}</div>);
		}

		do {
			calendarArray.push(<div className={`${PREFIX_CLASS}__calendar-body--date-disable`}>{nextMonthFirstDate}</div>);
			nextMonthFirstDate++;
		} while (new Date(`${nextYear}/${nextMonth}/${nextMonthFirstDate}`).getDay() != 0);

		days.forEach(day => {
			calendarArray.unshift(<div className={`${PREFIX_CLASS}__calendar-body--date-week`}>{day}</div>);
		});

		return (
			<div className={`${PREFIX_CLASS}__calendar-body--date`}>
				{ calendarArray.map((item, index) => (
					<div key={index}>{item}</div>
				))}
			</div>
		);
	}
	function _renderMonth() {
		return (
			<div className={`${PREFIX_CLASS}__calendar-body--month`}>
				month
			</div>
		);
	}
	function _renderYear() {
		return (
			<div className={`${PREFIX_CLASS}__calendar-body--year`}>
				year
			</div>
		);
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
					<div onClick={changeMode}> {calendarMode[mode].header} </div>
					<span onClick={() => {calendarMode[mode].optionsClick(1);}}> &gt; </span>
				</div>
				<div className={`${PREFIX_CLASS}__calendar-body`}>
					{calendarMode[mode].body}
				</div>
			</div>
		</div>
	);
}

DatePicker.propTypes = propTypes;

export default DatePicker;
