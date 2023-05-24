import React, { Component, Fragment } from "react";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import TextField from "./TextField";
import RepeaterField from "./RepeaterField";
import TrueFalseField from "./TrueFalseField";
import RadioField from "./RadioField";
import CheckboxField from "./CheckboxField";
import GroupField from "./GroupField";
import TimePickerField from "./TimePickerField";
import DatePickerField from "./DatePickerField";
import Photographs from "./FieldsByKeys/Photographs";
import InsuranceFileField from "./FieldsByKeys/InsuranceFileField";

export default class Fields extends Component {
	render() {
		const { type, key } = this.props.field;
		let input;
		const fieldClass = this.props.field?.wrapper?.class;

		// forward by field key.
		if ("field_5cac834f2a1d0" === key) {
			input = <Photographs {...this.props} />;
		} else if ("field_5cac82913a484" === key) {
			input = <InsuranceFileField {...this.props} />;
		}

		// forward by field class.
		else if (fieldClass?.length > 1 && "js-timepicker" === fieldClass) {
			input = <TimePickerField {...this.props} />;
		} else if (fieldClass?.length > 1 && "js-datepicker" === fieldClass) {
			input = <DatePickerField {...this.props} />;
		}

		// forward by field type.
		else if ("select" === type) {
			input = <SelectField {...this.props} />;
		} else if ("textarea" === type) {
			input = <TextAreaField {...this.props} />;
		} else if ("text" === type || "email" === type || "number" === type) {
			input = <TextField {...this.props} />;
		} else if ("repeater" === type) {
			input = <RepeaterField {...this.props} />;
		} else if ("true_false" === type) {
			input = <TrueFalseField {...this.props} />;
		} else if ("radio" === type) {
			input = <RadioField {...this.props} />;
		} else if ("checkbox" === type) {
			input = <CheckboxField {...this.props} />;
		} else if ("group" === type) {
			input = <GroupField {...this.props} />;
		}

		return <Fragment>{input}</Fragment>;
	}
}
