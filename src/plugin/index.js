import React, { useState, } from 'react';
import DatePicker from './datePicker';
import PropTypes from 'prop-types';

const propTypes = {};

function Main() {
	return (
		<div>
			<DatePicker
				onSelect={(date) => {console.log(date);}}
			/>
		</div>
	);
}

Main.propTypes = propTypes;

export default Main;
