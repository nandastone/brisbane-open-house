import React, { Component, Fragment } from 'react'
import { Form, FormControl, FormGroup, ControlLabel, HelpBlock, Col, Radio, Button, OverlayTrigger, Tooltip, Alert } from "react-bootstrap";
import he from 'he';

export default class TextAreaField extends Component {
	render() {
		const {label, key, instructions, rows } = this.props.field;
		const {required, isRightAlignLabel, isSubField, noLabel } = this.props;
		let {value} = this.props;
		value = (value === null || 'undefined' === typeof value) ? '' : he.decode(value);

		// calculate number of rows.
		const calculatedRows = ('number' === typeof rows) ? rows : 4;

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

		const input = <FormControl
				onChange={this.props.onChange}
				name={name}
				placeholder=""
				defaultValue={value}
				required={required}
				data-issubfield={(isSubField)}
				componentClass="textarea"
				rows={calculatedRows}
			/>;
		return (
			<Fragment>

				{/**
				 <pre>
				 {JSON.stringify(field, null, "\t")}
				 </pre>
				 */}

				<FormGroup controlId={name} className={classes}>
					{ noLabel ? (
						<Col md={12}>
							{input}
						</Col>
					) : (
						<Fragment>
							<Col componentClass={ControlLabel} md={4}>
								{calculatedLabel}
								{ hasTooltip && overlay }
							</Col>
							<Col md={8}>
								{input}
							</Col>
						</Fragment>
					)}
				</FormGroup>

			</Fragment>
		)
	}
}
