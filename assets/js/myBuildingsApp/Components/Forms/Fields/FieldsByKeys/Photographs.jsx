import React, {useCallback, useState, useEffect } from 'react'
import {useDropzone} from 'react-dropzone'
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
import axios from 'axios';
import Fields from "../RepeaterField";
import PhotographFields from './PhotographFields';

export default props => {

	const {api, buildingId, field, handlePhotographAddedImage, setSubmittingState} = props;
	const {value} = props.field;
	const max = props.field?.max;
	// console.log('Photographs value:', value);
	let localFields = [];
	for( let i = 0; i < max; i++ ) {
		localFields.push(
			<PhotographFields
				key={i}
				index={i}
				value={{ imageCredit: value?.[i]?.field_5cac83c42a1d2, imageId: value?.[i]?.field_5cac83ae2a1d1,  }}
				api={api}
				handlePhotographAddedImage={handlePhotographAddedImage}
				buildingId={buildingId}
				setSubmittingState={setSubmittingState}
			/>
		)
	}
	
	return (
		<React.Fragment>
			{localFields}
		</React.Fragment>
	)
};
