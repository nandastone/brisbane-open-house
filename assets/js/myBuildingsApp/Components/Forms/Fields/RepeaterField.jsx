import React, { Component, Fragment } from 'react'
import { Form, FormControl, FormGroup, ControlLabel, HelpBlock, Col, Radio, Button, OverlayTrigger, Tooltip, Alert } from "react-bootstrap";
import Fields from './Fields';

export default class RepeaterField extends Component {
	render() {

		const field = this.props.field;
		const {api, buildingId} = this.props;
		// console.log('RepeaterField props.field:', this.props);
		const {sub_fields, value} = this.props.field;
		const firstIsRequired = this.props?.firstIsRequired;
		const max = this.props.field?.max;
		const shouldAppendWithCount = (this.props?.shouldAppendWithCount);
		// console.log('sub_fields', sub_fields);
		// console.log('firstIsRequired', firstIsRequired);
		// console.log('max', max);
		let localFields = [];
		for( let i = 0; i < max; i++ ) {
			localFields.push(
				sub_fields.map((v, index) => {
					// console.log('repeater localFields v:', v);
					// console.log('repeater localFields key:', index);
					let currFK = v.key;
					let currValue = value?.[i]?.[currFK];
					let isRequired = false; let appendedLabel = '';
					if ( true === firstIsRequired && 0 === i ) {
						isRequired = true;
					}
					if ( true === shouldAppendWithCount && 'name' === sub_fields[index].name ) {
						appendedLabel = ` ${i + 1}`;
					}
					// console.log('Repeater: currFK', currFK);

					return (
						<Fields
							key={index}
							onChange={this.props.onChange}
							field={ {...sub_fields[index]} }
							value={currValue}
							required={isRequired}
							prependFieldName={`${this.props.field.key}.value.${i}`}
							valueFieldName={`${this.props.field.key}.value`}
							appendedLabel={appendedLabel}
							isSubField={true}
							api={api}
							buildingId={buildingId}
							handlePhotographAddedImage={this.props.handlePhotographAddedImage}
							i={i}
						/>
					)
				})
			)
		}
		return (
			<Fragment>

				{/**
				 <pre>
				 {JSON.stringify(field, null, "\t")}
				 </pre>
				 */}

				{localFields}

			</Fragment>
		)
	}
}
