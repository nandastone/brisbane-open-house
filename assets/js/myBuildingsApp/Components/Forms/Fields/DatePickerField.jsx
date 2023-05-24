import React, { Component, Fragment } from "react";
import {
	Form,
	FormControl,
	FormGroup,
	ControlLabel,
	HelpBlock,
	Col,
	Radio,
	Button,
	OverlayTrigger,
	Tooltip,
	Alert,
} from "react-bootstrap";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { formatDate, parseDate } from "react-day-picker/moment";
import "react-day-picker/lib/style.css";

export default class DatePickerField extends Component {
	render() {
		const { label, key, type, instructions } = this.props.field;
		const {
			required,
			value,
			isRightAlignLabel,
			isSubField,
			groupSubField,
			onChange,
			onDayPickerChange,
		} = this.props;

		const isGroupSubField =
			"undefined" != typeof groupSubField && groupSubField;

		// calculating extra classes.
		let classes = "Datepicker-field ";
		if (required) classes += " required ";
		if (isRightAlignLabel) classes += " isRightAlignLabel ";

		// calculating field name.
		let name;
		if (isSubField) {
			const prependFieldName = this.props.prependFieldName;
			if ("undefined" != typeof prependFieldName)
				name = `${prependFieldName}.${key}`;
			if (isGroupSubField) name = `${prependFieldName}.value.${key}`;
		} else {
			name = `${key}.value`;
		}

		// calculating label.
		let calculatedLabel = label;
		if (
			"undefined" !== typeof this.props.appendedLabel &&
			this.props.appendedLabel.length > 0
		)
			calculatedLabel = label + this.props.appendedLabel;

		// calculating tooltip/instructions.
		let hasTooltip = false,
			tooltip,
			overlay;
		if ("undefined" !== typeof instructions && instructions.length > 0) {
			hasTooltip = true;
			tooltip = <Tooltip id="tooltip">{instructions}</Tooltip>;
			overlay = (
				<OverlayTrigger placement="right" overlay={tooltip}>
					<span className="badge helper helper-tooltip">?</span>
				</OverlayTrigger>
			);
			classes += " has-tooltip ";
		}

		return (
			<Fragment>
				<FormGroup controlId={name} className={classes}>
					<Col componentClass={ControlLabel} md={4}>
						{calculatedLabel}
						{hasTooltip && overlay}
					</Col>
					<Col md={8}>
						<DayPickerInput
							value={value}
							onDayChange={onDayPickerChange}
							format="D/M/YYYY"
							formatDate={formatDate}
							parseDate={parseDate}
							placeholder="DD/MM/YYYY"
							inputProps={{
								name: name,
								required: { required },
								className: "form-control",
								type: "text",
							}}
						/>
					</Col>
				</FormGroup>
			</Fragment>
		);
	}
}
