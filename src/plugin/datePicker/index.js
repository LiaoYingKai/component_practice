import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { MonthEnums, CalendarModeEnums } from './enums';
import './style.scss';

const PREFIX_CLASS = 'date-picker';

const propTypes = {
	className: PropTypes.string,
	onSelect: PropTypes.func,
};

const {
	DATE,
	MONTH,
	YEAR,
} = CalendarModeEnums;

function DatePicker({
	className,
	onSelect,
}) {
	const [day, setDay] = useState(new Date());
	const [year, setYear] = useState(day.getFullYear());
	const [month, setMonth] = useState(day.getMonth() + 1);
	const [date, setDate] = useState(day.getDate());
	const [yearRange, setYearRange] = useState([]);
	const [mode, setMode] = useState(DATE);
	const [calendarVisible, setCalendarVisable] = useState(false);
	const [isFocus, setIsFocus] = useState(true);
	const [inDiv, setInDiv] = useState(true);
	const CalendarMode = {
		[DATE]: {
			optionsClick: _handleChangeDateModeBody,
			header: _renderDateModeHeaderText(),
			body: _renderDateModeBody(),
		},
		[MONTH]: {
			optionsClick: _handleChangeMonthModeBody,
			header: _renderMonthModeHeaderText(),
			body: _renderMonthModeBody(),
		},
		[YEAR]: {
			optionsClick: _handleChangeYearModeBody,
			header: _renderYearModeHeaderText(),
			body: _renderYearModeBody(),
		},
	};

	function _handleChangeMode() {
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

	// DateMode
	function _renderDateModeHeaderText() {
		return `${MonthEnums[month].month} ${year}`;
	}
	function _renderDateModeBody() {
		const weeks = ['Su','Mo','Tu','We','Th','Fr','Sa'];
		const calendarArray = [];

		let nextYear = year;
		let nextMonth = month;
		let nextMonthFirstDate = 1;
		if (nextMonth + 1 > 12) {
			nextMonth = 1;
			nextYear = nextYear + 1;
		} else {
			nextMonth = nextMonth + 1;
		}

		let prevYear = year;
		let prevMonth = month;
		if (prevMonth - 1 === 0) {
			prevMonth = 12;
			prevYear = prevYear - 1;
		} else {
			prevMonth = prevMonth - 1;
		}
		let prevMonthLastDate = MonthEnums[prevMonth].days;
		if (prevYear % 4 === 0 && prevMonth === 2) {
			prevMonthLastDate++;
		}

		let thisMonthDays = MonthEnums[month].days;
		if (year % 4 === 0 && month === 2) {
			thisMonthDays++;
		}

		do {
			calendarArray.unshift(<div className={`${PREFIX_CLASS}__calendar-body--date-disable`}>{prevMonthLastDate}</div>);
			prevMonthLastDate--;
		} while (new Date(`${prevYear}/${prevMonth}/${prevMonthLastDate}`).getDay() != 6);

		for (let i = 1; i <= thisMonthDays; i++) {
			let className = '';
			if (i === date) {
				className = `${PREFIX_CLASS}__calendar-body--date-this-month ${PREFIX_CLASS}__calendar-body--date-selected`;
			} else {
				className = `${PREFIX_CLASS}__calendar-body--date-this-month`;
			}
			calendarArray.push(
				<div 
					className={className}
					onClick={() => _handelSelectDate(year, month, i)}
				>{i}</div>
			);
		}

		do {
			calendarArray.push(<div className={`${PREFIX_CLASS}__calendar-body--date-disable`}>{nextMonthFirstDate}</div>);
			nextMonthFirstDate++;
		} while ((new Date(`${nextYear}/${nextMonth}/${nextMonthFirstDate}`).getDay() != 0) || (calendarArray.length != 42));

		weeks.forEach(day => {
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
	function _handleChangeDateModeBody(event) {
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
	function _handelSelectDate(year, month, date) {
		const selectedDate = new Date(`${year}/${month}/${date}`);
		setDate(date);
		setDay(selectedDate);
		onSelect(selectedDate);
		setCalendarVisable(false);
	}

	// MonthMode
	function _renderMonthModeHeaderText() {
		return year;
	}
	function _renderMonthModeBody() {
		return (
			<div className={`${PREFIX_CLASS}__calendar-body--month`}>
				{
					Object.values(MonthEnums).map((monthEnum, index) => {
						const className = index + 1 === month ? `${PREFIX_CLASS}__calendar-body--month-selected`: null;
						return  (
							<div
								key={monthEnum.month}
								className={className}
								onClick={() => _handleSelectMonth(index)}
							> 
								<div>{monthEnum.month}</div>
							</div>
						);
					})
				}
			</div>
		);
	}
	function _handleChangeMonthModeBody(event) {
		setYear(year + event);
	}
	function _handleSelectMonth(index) {
		setMonth(index + 1);
		setMode(DATE);
	}

	// YearMode
	function _renderYearModeHeaderText() {
		return `${yearRange[0]} - ${yearRange[1]}`;
	}
	function _renderYearModeBody() {
		if (yearRange.length === 0) return;
		const yearRangeArray = [];
		yearRangeArray.push(<div className={`${PREFIX_CLASS}__calendar-body--year-disable`}>{yearRange[0] - 1}</div>);
		for (let i = yearRange[0]; i <= yearRange[1]; i++) {
			const className = i === year ? `${PREFIX_CLASS}__calendar-body--year-selected`: null;

			yearRangeArray.push(
				<div
					className={className}
					onClick={() => {_handleSelectYear(i);}}
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
	function _handleChangeYearModeBody(event) {
		setYear(year + 10 * event);
	}
	function _handleSelectYear(year) {
		setYear(year);
		setMode(MONTH);
	}

	function _handleConvertDateFormat() {
		const year = day.getFullYear();
		const month = day.getMonth() + 1 >= 10 ? day.getMonth() + 1 : `0${day.getMonth() + 1}`;
		const date = day.getDate() >= 10 ? day.getDate() : `0${day.getDate()}`;
		return `${year}-${month}-${date}`;
	}
	useEffect(() => {
		const range = Math.floor(year /10) * 10;
		setYearRange([range, range + 9]);
	}, [year]);

	useEffect(() => {
		if (!isFocus && !inDiv) {
			setCalendarVisable(false);
		}
	},[isFocus, inDiv]);

	return (
		<div
			className={cx(PREFIX_CLASS, className)}
			onFocus={() => {setIsFocus(true);}}
			onBlur={() => {setIsFocus(false);}}
			onMouseEnter={() => {setInDiv(true);}}
			onMouseLeave={() => {setInDiv(false);}}
		>
			<input 
				value={_handleConvertDateFormat()}
				onClick={() => {setCalendarVisable(true);}}
				readOnly={true}
			></input>
			<div className={cx(
				`${PREFIX_CLASS}__calendar`,
				{ [`${PREFIX_CLASS}__calendar--visible`]: calendarVisible }
			)}>
				<div className={`${PREFIX_CLASS}__calendar-header`}>
					<span onClick={() => {CalendarMode[mode].optionsClick(-1);}}> &lt; </span>
					<div onClick={_handleChangeMode}> {CalendarMode[mode].header} </div>
					<span onClick={() => {CalendarMode[mode].optionsClick(1);}}> &gt; </span>
				</div>
				<div className={`${PREFIX_CLASS}__calendar-body`}>
					{CalendarMode[mode].body}
				</div>
			</div>
		</div>
	);
}

DatePicker.propTypes = propTypes;

export default DatePicker;
