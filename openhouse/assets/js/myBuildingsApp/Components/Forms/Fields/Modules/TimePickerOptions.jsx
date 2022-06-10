import PropTypes from 'prop-types';
import moment from 'moment';
import React, {Component} from 'react';

class TimePickerOptions extends Component {

	isEarlierThanEndLimit(timeValue, endLimit, lastValue, beginLimit) {
		const timeValueIsEarlier = moment(timeValue, 'h:mm A').diff(moment(endLimit, 'h:mm A')) < 0;
		const timeValueIsLaterThanLastValue = lastValue === undefined ? true : moment(lastValue, 'h:mm A').diff(moment(timeValue, 'h:mm A')) < 0;
		return timeValueIsEarlier && timeValueIsLaterThanLastValue;
	}
	render() {
		let beginLimit = this.props.beginLimit || "7:45AM";
		let timeValue = beginLimit;
		let lastValue;
		let endLimit = this.props.endLimit || "6:00PM";
		let step = this.props.step || 15;

		let options = [<option key={0} value={''}>Please select</option>];

		while ( this.isEarlierThanEndLimit(timeValue, endLimit, lastValue, beginLimit) ) {
			lastValue = timeValue;
			// console.log(timeValue, moment(timeValue, 'h:mm A').diff(moment(endLimit, 'h:mm A'), 'minutes'));
			timeValue = moment(timeValue, 'h:mm A').add(step, 'minutes').format('h:mm A');
			// if (timeValue === beginLimit) {
			// 	continue;
			// }
			options.push(<option key={timeValue} value={timeValue}>{timeValue}</option>)
		}
		return (
			<React.Fragment>
				{options}
			</React.Fragment>
		);
	}
}

export default TimePickerOptions;
