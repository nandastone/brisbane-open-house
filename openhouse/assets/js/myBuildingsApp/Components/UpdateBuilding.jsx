import React, {Component} from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';
import {Link, Route, Redirect} from 'react-router-dom';
import slugify from 'slugify';
import axios from 'axios';
import FinaliseAndSubmit from "./Forms/FinaliseAndSubmit";
import TabForm from "./Forms/TabForm";
import merge from "lodash.merge";
import Loader from './loader';

function withProps(Component, props) {
	return function(matchProps) {
		return <Component {...props} {...matchProps} />
	}
}

class UpdateBuilding extends Component {
	constructor(props) {
		super(props);
		this.state = {
			buildingId: this.props.match.params.id,
		};
	}

	componentDidMount() {
		const api = this.props.api;
		axios.all([
			axios.get(api.INTRO_ENDPOINT),
			// axios.get(api.BUILDING_DETAILS_FIELDS_ENDPOINT + `?no-format=1`),
		])
			.then(axios.spread((introRes) => {
				this.setState(
					{ ...this.state, intro: introRes.data },
					() => console.log('App cDM api loaded, state:', this.state)
				);
			}));
	}

	render() {
		const {tabs, handleShowConfirmationModal} = this.props;

		let form, path;
		form = tabs.map((tab, i) => {
			// defaults to the first tab if no form tab was selected.
			if ( 0 === i ) {
				path = `${this.props.match.url + '(/' + slugify(tab.name).toLowerCase() + ')?' }`;
			} else {
				path = `${this.props.match.url + '/' + slugify(tab.name).toLowerCase() }`;
			}

			// find the tabIndex we currently at from tabs.
			const tabIndex = Object.keys(tabs).find( index => tabs[index].key === tab.key );
			let componentProps = {
				tab: tabs[tabIndex],
				buildingId: this.state.buildingId,
				api: this.props.api,
				// fields: this.props.fields,
				loader: <Loader />,
				nextTabURL: `/`,
			};

			if ( ('FINALISE_AND_SUBMIT' !== tab.key) ) {
				componentProps.nextTabURL = `${this.props.match.url + '/' + slugify(tabs[i+1].name).toLowerCase() }`;
			} else {
				componentProps.handleShowConfirmationModal = handleShowConfirmationModal;
			}

			// console.log('componentProps', componentProps);
			
			return (
				<Route
					key={tab.key}
					exact path={path}
					component={('FINALISE_AND_SUBMIT' === tab.key) ? withProps(FinaliseAndSubmit, componentProps) : withProps(TabForm, componentProps)}
				/>
			)
		});
		return (
			<Grid className="UpdateBuilding-container">
				<Row>
					<Col className="Tab-wrapper" sm={4} lg={3}>
						{
							tabs
								.map((tab, idx) => {
									let url = `${this.props.match.url + '/' + slugify(tab.name).toLowerCase()}`;
									let isCurrent = (url === this.props.location.pathname);
									isCurrent = ( 0 === idx && this.props.match.url === this.props.location.pathname ) ? true : isCurrent;
									return (
										<Link
											key={tab.key}
											className={`tab ${(isCurrent) ? 'active': ''}`}
											to={url}
										>
											<Button><span>{tab.name}</span></Button>
										</Link>
									)
								})
						}
					</Col>
					<Col className="Form-wrapper" sm={8} lgOffset={1}>
						{form}
					</Col>
				</Row>
			</Grid>
		);
	}
}

export default UpdateBuilding;
