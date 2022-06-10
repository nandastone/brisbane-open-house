import React, { Component, Fragment } from 'react'
import {
	Form,
	FormControl,
	FormGroup,
	ControlLabel,
	HelpBlock,
	Grid,
	Row,
	Col,
	Checkbox,
	Button,
	OverlayTrigger,
	Tooltip,
	Alert,
	Radio
} from "react-bootstrap";
import Fields from "./Fields";

export default class GroupField extends Component {
	render() {
		const {label, key, type, instructions, choices, sub_fields} = this.props.field;
		const {required, value, isRightAlignLabel, isSubField, onChange } = this.props;

		// calculating extra classes.
		let classes = '';
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

		const localFields = sub_fields.map((v, index) => {
			// console.log('repeater localFields v:', v);
			// console.log('repeater localFields key:', index);
			let currFK = v.key;
			let currValue = value?.[currFK];
			// console.log('currFK', currFK);
			// console.log('currValue', currValue);
			// console.log('sub_fields[index]', sub_fields[index]);

			return (
				<Fields
					key={index}
					onChange={this.props.onChange}
					field={ {...sub_fields[index]} }
					value={currValue}
					required={required}
					prependFieldName={`${this.props.field.key}`}
					isSubField={true}
					groupSubField={true}
					isRightAlignLabel={true}
				/>
			)
		});
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
						{localFields}
					</Col>
				</FormGroup>

			</Fragment>
		)
	}
}
