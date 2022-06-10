import React, { Component, Fragment } from 'react'
import {
	Form,
	FormControl,
	FormGroup,
	ControlLabel,
	HelpBlock,
	Col,
	Checkbox,
	Button,
	OverlayTrigger,
	Tooltip,
	Alert,
	Radio
} from "react-bootstrap";

export default class CheckboxField extends Component {
	render() {
		const {label, key, type, instructions, choices} = this.props.field;
		const {required, value, isRightAlignLabel, isSubField, onChange } = this.props;

		// calculating extra classes.
		let classes = key + ' ';
		classes += ` inputType-${type} `;
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

		// console.log('checkbox, obtained value:', value);
		// console.log('checkbox, this.props:', this.props);
		// console.log('choices', choices);

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
							Object.keys(choices).map((optionValue, index) => {
								const optionLabel = choices[optionValue];
								return(
									<Fragment key={index}>
										<Checkbox
											name={`${name}`}
											value={optionValue}
											data-issubfield={(isSubField)}
											onChange={onChange}
											checked={(value?.includes(optionValue))}
											inline>
											{optionLabel}
										</Checkbox>
									</Fragment>
								)
							})
						}
					</Col>
				</FormGroup>

			</Fragment>
		)
	}
}
