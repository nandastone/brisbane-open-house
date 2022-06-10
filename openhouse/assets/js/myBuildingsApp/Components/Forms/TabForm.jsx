import React, {Component} from 'react';
import {Alert, Button, Col, ControlLabel, FormGroup, Form, Grid} from "react-bootstrap";
import Fields from './Fields/Fields';

import UnsavedChangesPrompt from './unsavedChangesPrompt';
import qs from "qs";
import merge from "lodash.merge";
import axios from "axios";
import {Redirect} from "react-router";
import set from 'set-value';
import objectPath from 'object-path';

Object.byString = function(o, s) {
	s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
	s = s.replace(/^\./, '');           // strip a leading dot
	var a = s.split('.');
	for (var i = 0, n = a.length; i < n; ++i) {
		var k = a[i];
		if (k in o) {
			o = o[k];
		} else {
			return;
		}
	}
	return o;
};

class TabForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldPrompt: false,
			buildingDetails: {},
			isLoading: true,
			shouldRedirect: false,
		};

		this.handlePhotographAddedImage = this.handlePhotographAddedImage.bind(this);
		this.handleUploadFile = this.handleUploadFile.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleDayPickerChange = this.handleDayPickerChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setSubmittingState = this.setSubmittingState.bind(this);

		console.log('Form received:', this.props);
	}

	setSubmittingState(status) {
		if ( false === status ) {
			this.setState({
				...this.state,
				isSubmitting: false,
			})
		}
		else if ( true === status ) {
			this.setState({
				...this.state,
				isSubmitting: true,
			})
		}
	}

	handleUploadFile(field_key, value, action = 'add') {
		let {buildingDetails} = this.state;
		if ('add' === action) {
			buildingDetails[field_key].value = value.toString();
		} else {
			buildingDetails[field_key].value = null;
		}
		let newState = this.state;
		newState.buildingDetails = buildingDetails;
		this.setState(
			{ ...newState, shouldPrompt: true },
			() => console.log('newState:', this.state)
		);
	}

	handleSubmit(event) {
		event.preventDefault();
		console.log('saving...');

		let payload = {};
		const {buildingDetails} = this.state;
		const {api, buildingId} = this.props;

		// Filter buildingDetails, so that only key => { value: $value } will be sent.
		Object.keys(buildingDetails).map( (key, index) => {
			// console.log('index', index);
			// console.log('key', key);
			if ( 'buildingId' === key ) {
				payload[key] = buildingDetails[key];
			} else {
				payload[key] = { value: buildingDetails[key].value }
			}
		} );

		// console.log("cool, we are submitting this now:", JSON.stringify(payload));

		this.setState(
			{ ...this.state, isSubmitting: true },
			() => {
				axios.defaults.headers.common['X-WP-Nonce'] = this.props.api.NONCE_HEADER;
				axios
					.post(
						api.BUILDING_DETAILS_UPDATE_ENDPOINT + buildingId,
						payload
					)
					.then(res => {
						const response = res.data;

						if ('success' === response.status) {
							this.setState(
								{
									...this.state,
									isSubmitting: false,
									shouldRedirect: true,
									shouldPrompt: false,
								},
								() => {
									document.getElementById("root").scrollIntoView();
								}
							);
						}
						// console.log("we got:", response);
					});
			}
		);
	}

	handlePhotographAddedImage(value, i, action = 'add') {
		// console.log('Tab Form handleValueUpdate');
		// console.log('value', value);
		// console.log('i', i);
		// console.log('action', action);

		let {buildingDetails} = this.state;
		let currentValues = buildingDetails.field_5cac834f2a1d0.value;
		if ( null === currentValues || false === Array.isArray(currentValues) ) {
			currentValues = [];
		}
		if ( 'add' === action ) {
			currentValues[i] = {
				field_5cac83ae2a1d1: value.imageId.toString(),
				field_5cac83c42a1d2: value.imageCredit.toString(),
			};
		} else {
			currentValues[i] = {
				field_5cac83ae2a1d1: "",
				field_5cac83c42a1d2: "",
			};
		}
		buildingDetails.field_5cac834f2a1d0.value = currentValues;
		let newState = this.state;
		newState.buildingDetails = buildingDetails;
		this.setState(
			{ ...newState, shouldPrompt: true },
			() => console.log('newState:', this.state)
		);
	}

	handleDayPickerChange(selectedDay, modifiers, dayPickerInput) {
		const target = dayPickerInput.input;
		const {name, value} = target;
		let parsedQsString = set({}, name, value);
		let {buildingDetails} = this.state;
		buildingDetails = merge(buildingDetails, parsedQsString);
		let newState = this.state;
		newState.buildingDetails = buildingDetails;
		this.setState(
			{ ...newState, shouldPrompt: true },
			() => console.log('newState:', this.state)
		);
	}

	handleInputChange(event) {
		// console.log('Tab event handleInputChange detected!', event);
		// console.log('target name', event.target.name);
		// console.log('target type', event.target.type);
		// console.log('target checked', event.target.checked);
		// console.log('target value', event.target.value);
		const {name, value} = event.target;
		// let {value} = event.target;
		// console.log('name', name);
		// console.log('value init', value);
		// value = he.encode(value);
		// console.log('value encoded', value);
		let {buildingDetails} = this.state;
		let parsedQsString;
		if ( 'checkbox' === event.target.type ) {
			// let selected = Object.byString(buildingDetails, name);
			let selected = objectPath.get(buildingDetails, name);
			console.log('selected', selected);
			console.log('selected type', typeof selected);
			if ( true === event.target.checked ) {
				if ( 'string' === typeof selected || null === selected ) {
					selected = [];
				}
				selected.push(value);
			} else {
				selected.splice( selected.indexOf(value), 1 );
			}
			let values = { value: selected };
			let qsString = '', z = 0;
			if (selected.length > 0) {
				selected.map(s => { qsString += `${name}[]=${encodeURI(s)}&`; z++; });
			} else {
				qsString = `${name}[]=`;
			}
			// parsedQsString = qs.parse(qsString);
			parsedQsString = set({}, name, selected);
		} else {
			// parsedQsString = qs.parse(`${name}=${value}`, { arrayLimit: 0 });
			parsedQsString = set({}, name, value);
		}
		// console.log('inserting new value:', parsedQsString);
		buildingDetails = merge(buildingDetails, parsedQsString);
		let newState = this.state;
		newState.buildingDetails = buildingDetails;
		this.setState(
			{ ...newState, shouldPrompt: true },
			// () => console.log('newState:', this.state)
		);
	}

	componentDidMount() {
		const api = this.props.api;
		axios.defaults.headers.common['X-WP-Nonce'] = this.props.api.NONCE_HEADER;
		axios.all([
			axios.get(api.BUILDING_DETAILS_FIELDS_ENDPOINT + `?no-format=1`),
			axios.get(api.BUILDING_DETAILS_ENDPOINT + this.props.buildingId + `?no-format=1`),
		])
			.then(axios.spread((fieldsRes, detailsRes) => {
				const buildingDetails = merge(fieldsRes.data, detailsRes.data)
				this.setState(
					{ ...this.state, buildingDetails: buildingDetails, isLoading: false },
					() => {
						console.log('App cDM api loaded, state:', this.state);
						document.getElementById("root").scrollIntoView();
					}
				);
			}));
	}

	render() {
		const {loader, api, buildingId} = this.props;
		const {buildingDetails} = this.state;
		const {key, description, fields} = this.props.tab;

		const loaderInline = React.cloneElement(loader, {isInline: true});

		/**
		 * Inputs should only be the fields defined under this tab.
		 * @type {*[]}
		 */
		const inputs = Object.keys(fields).map((v, index) => {
			let key = Object
				.keys(buildingDetails)
				.find(
					index => buildingDetails[index].key === v
				);

			if ( undefined === typeof key ) return;

			let value = buildingDetails?.[v]?.value;

			// console.log('api', api);

			return (
				<Fields
					key={index}
					onChange={this.handleInputChange}
					onDayPickerChange={this.handleDayPickerChange}
					value={value}
					field={ {...buildingDetails[key]} }
					{ ...fields[v] }
					api={api}
					buildingId={buildingId}
					handlePhotographAddedImage={this.handlePhotographAddedImage}
					handleUploadFile={this.handleUploadFile}
					setSubmittingState={this.setSubmittingState}
				/>
			)
		});
		return (

			<React.Fragment>
				{ this.state.shouldRedirect &&
				<Redirect to={this.props.nextTabURL} />
				}
				<UnsavedChangesPrompt
					when={this.state.shouldPrompt}
				/>
				{ this.state.isLoading && loader }
				{ false === this.state.isLoading &&
					<React.Fragment>
						<Form horizontal onSubmit={this.handleSubmit} className={`Form-${key}`}>

							{ (description.length > 0) &&
								<FormGroup className="Tab-description">
									<Col sm={12}>
										<ControlLabel>
											{description}
										</ControlLabel>
									</Col>
								</FormGroup>
							}
						{inputs}

						<Button className="fg-submitButton" type="submit" disabled={this.state.isSubmitting === true}>
							Save
							{ this.state.isSubmitting &&
								loaderInline
							}
						</Button>
						</Form>
					</React.Fragment>
				}
			</React.Fragment>
		);
	}
}

export default TabForm;
