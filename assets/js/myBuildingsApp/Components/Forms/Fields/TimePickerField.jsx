import React, { Component, Fragment } from 'react'
import { Form, FormControl, FormGroup, ControlLabel, HelpBlock, Col, Radio, Button, OverlayTrigger, Tooltip, Alert } from "react-bootstrap";
import TimePickerOptions from './Modules/TimePickerOptions';

export default class TimePickerField extends Component {
	render() {

		const {label, key, type, instructions} = this.props.field;
		const {required, value, isRightAlignLabel, isSubField, groupSubField } = this.props;

		// console.log('isRightAlignLabel', isRightAlignLabel);

		const isGroupSubField = ( 'undefined' != typeof groupSubField && (groupSubField));

		// calculating extra classes.
		let classes = '';
		if ( required ) classes += ' required ';
		if ( isRightAlignLabel ) classes += ' isRightAlignLabel ';

		// calculating field name.
		let name;
		if (isSubField) {
			const prependFieldName = this.props.prependFieldName;
			if ( 'undefined' != typeof prependFieldName) name = `${prependFieldName}.${key}`;
			if ( isGroupSubField ) name = `${prependFieldName}.value.${key}`;
		} else {
			name = `${key}.value`;
		}

		// calculating label.
		let calculatedLabel = label;
		if ( 'undefined' !== typeof this.props.appendedLabel && this.props.appendedLabel.length > 0 ) calculatedLabel = label + this.props.appendedLabel;

		// calculating tooltip/instructions.
		let hasTooltip = false, tooltip, overlay;
		if ( 'undefined' !== typeof instructions && instructions.length > 0 ) {
			hasTooltip = true;
			tooltip = <Tooltip id="tooltip">{instructions}</Tooltip>;
			overlay = <OverlayTrigger placement="right" overlay={tooltip}><span className="badge helper helper-tooltip">?</span></OverlayTrigger>;
		}

		return (
			<Fragment>

				{/**
				 <pre>
				 {JSON.stringify(field, null, "\t")}
				 </pre>
				 */}

				<FormGroup controlId={name} className={classes}>
					<Col componentClass={ControlLabel} md={4}>
						{calculatedLabel}
						{ hasTooltip && overlay }
					</Col>
					<Col md={8}>
						<FormControl
							onChange={this.props.onChange}
							name={name}
							placeholder=""
							defaultValue={(value) ? value : ''}
							required={required}
							data-issubfield={(isSubField)}
							componentClass="select"
						>
							<TimePickerOptions
								onChange={this.props.onChange}
								name={name}
								required={required}
								data-issubfield={(isSubField)}
							/>
						</FormControl>
					</Col>
				</FormGroup>

			</Fragment>
		)
	}
}
