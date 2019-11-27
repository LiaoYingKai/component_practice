import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { MonthEnums, CalendarModeEnums } from './enums';
import './style.scss';

const PREFIX_CLASS = 'date-picker';

const propTypes = {
	className: PropTypes.string,
};

const {
	DATE,
	MONTH,
	YEAR,
} = CalendarModeEnums;

function DatePicker({
	className,
}) {
	const [day, setDay] = useState(new Date());
	const [year, setYear] = useState(day.getFullYear());
	const [yearRange, setYearRange] = useState([]);
	const [month, setMonth] = useState(day.getMonth() + 1);
	const [date, setDate] = useState(day.getDate());
	const [calendarVisible, setCalendarVisable] = useState(true);
	const [mode, setMode] = useState(DATE);
	const calendarMode = {
		[DATE]: {
			optionsClick: changeMonthAtDateMode,
			header: `${MonthEnums[month].month} ${year}`,
			body: _renderDateMode(),
		},
		[MONTH]: {
			optionsClick: changeYearAtMonthMode,
			header: `${year}`,
			body: _renderMonthMode(),
		},
		[YEAR]: {
			optionsClick: changeYearRangeAtYearMode,
			header: `${yearRange[0]} - ${yearRange[1]}`,
			body: _renderYearMode(),
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

	function _renderDateMode() {
		// TODO 處理潤月的問題
		// TODO 處理要滿 42 個日期
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
			calendarArray.push(
				<div 
					className={className}
					onClick={() => selectDate(year, month, i)}
				>{i}</div>
			);
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
	function selectDate(year, month, date) {
		setDate(date);
		setDay(new Date(`${year}/${month}/${date}`));
		// setCalendarVisable(false);
	}
	function changeMonthAtDateMode(event) {
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

	function _renderMonthMode() {
		return (
			<div className={`${PREFIX_CLASS}__calendar-body--month`}>
				{
					Object.values(MonthEnums).map((monthEnum, index) => {
						const className = index + 1 === month ? `${PREFIX_CLASS}__calendar-body--month-selected`: null;
						return  (
							<div
								key={monthEnum.month}
								className={className}
								onClick={() => selectMonth(index)}
							>{monthEnum.month}</div>
						);
					})
				}
			</div>
		);
	}
	function selectMonth(index) {
		setMonth(index + 1);
		setMode(DATE);
	}
	function changeYearAtMonthMode(event) {
		setYear(year + event);
	}

	function _renderYearMode() {
		if (yearRange.length === 0) return;
		const yearRangeArray = [];
		yearRangeArray.push(<div className={`${PREFIX_CLASS}__calendar-body--year-disable`}>{yearRange[0] - 1}</div>);
		for (let i = yearRange[0]; i <= yearRange[1]; i++) {
			const className = i === year ? `${PREFIX_CLASS}__calendar-body--year-selected`: null;

			yearRangeArray.push(
				<div
					className={className}
					onClick={() => {selectYear(i);}}
				>
					{i}
				</div>
			);
		}
		yearRangeArray.push(<div className={`${PREFIX_CLASS}__calendar-body--year-disable`}>{yearRange[1] + 1}</div>);

		return (
			<div className={`${PREFIX_CLASS}__calendar-body--year`}>
				{
					yearRangeArray.map((item, index) => (
						<div key={index}>
							{item}
						</div>
					))
				}
			</div>
		);
	}
	function selectYear(year) {
		setYear(year);
		setMode(DATE);
	}
	function changeYearRangeAtYearMode(event) {
		setYear(year + 10 * event);
	}

	useEffect(() => {
		const range = Math.floor(year /10) * 10;
		setYearRange([range, range + 9]);
	}, [year]);

	return (
		<div className={cx(PREFIX_CLASS, className)}>
			<input 
				value={day}
				onClick={() => {setCalendarVisable(true);}}
				readOnly={true}
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
