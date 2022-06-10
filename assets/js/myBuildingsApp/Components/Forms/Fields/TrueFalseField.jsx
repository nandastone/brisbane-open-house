import React, { Component, Fragment } from 'react'
import { Form, FormControl, FormGroup, ControlLabel, HelpBlock, Col, Radio, Button, OverlayTrigger, Tooltip, Alert } from "react-bootstrap";

export default class TrueFalseField extends Component {
	render() {
		const {label, key, type, instructions} = this.props.field;
		const {required, value, isRightAlignLabel, isSubField, onChange } = this.props;

		// True/False Radio choices.
		const choices = [
			{ label: 'Yes', value: "1" },
			{ label: 'No', value: "0" },
		];

		// calculating extra classes.
		let classes = '';
		if ( required ) classes += ' required ';
		if ( isRightAlignLabel ) classes += ' isRightAlignLabel ';

		// calculating field name.
		let name;
		if (isSubField) {
			const prependFieldName = this.props.prependFieldName;
			if ( 'undefined' != typeof prependFieldName) name = `${prependFieldName}.${key}`;
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
			classes += ' has-tooltip ';
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
					<Col md={8} className="Input-col">
							{
								Object.keys(choices).map((index) => {
									// console.log('building value: ', value);
									// console.log('building value boolean: ', Boolean(value));
									// console.log('this radio value: ', choices[index].value);
									return(
										<Radio
											key={index}
											name={name}
											value={choices[index].value}
											data-issubfield={(isSubField)}
											onChange={onChange}
											// checked={(choices[index].value === Boolean(parseInt(value)))}
											checked={(choices[index].value.toString() === value?.toString())}
											required={required}
										inline>
											{choices[index].label}
										</Radio>
									)
								})
							}
					</Col>
				</FormGroup>

			</Fragment>
		)
	}
}
