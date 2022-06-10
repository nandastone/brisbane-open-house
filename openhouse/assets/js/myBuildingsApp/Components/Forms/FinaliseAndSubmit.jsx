import React, { Component } from 'react'
import { Form, FormControl, FormGroup, ControlLabel, HelpBlock, Col, Checkbox, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import {Redirect} from "react-router";

export default class FinaliseAndSubmit extends Component {
  constructor(props){
		super(props);
    this.state = {
			BUMP_STATUS: false,
			shouldRedirect: false,
			isSubmitting: false,
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInputChange(event) {
    const target = event.target;
		const name = target.name;
		if ( 'BUMP_STATUS' !== name || target.type !== 'checkbox' ) {
			return;
		}

		let value;

		value = (target.checked);
		console.log('value', value);

		let newState = this.state;
		newState.BUMP_STATUS = value;
		this.setState(
			newState
		);
	}

	handleSubmit(event) {
		event.preventDefault();

		const {api, buildingId, handleShowConfirmationModal} = this.props;
		const payload = {
			bump: true,
		};
		this.setState( {...this.state, isSubmitting: true} )

		axios
			.post(
				api.BUILDING_STATUS_BUMP_ENDPOINT + buildingId,
				payload
			)
			.then(res => {
				const response = res.data;
				console.log("we got:", response);
				this.setState(
					{...this.state, shouldRedirect: true, isSubmitting: false},
					() => handleShowConfirmationModal()
				)
			});
	}

	componentDidMount() {
  	document.getElementById('root').scrollIntoView();
	}

	render() {
  	const loader = React.cloneElement(this.props.loader, {isInline: true});
		return (
			<Form onSubmit={this.handleSubmit} className="FinaliseAndSubmit">

				{ this.state.shouldRedirect &&
					<Redirect to={this.props.nextTabURL} />
				}

					<FormGroup>
						<Col sm={12}>
							<ControlLabel className="terms">
								<strong style={{ fontSize: '120%' }}>STOP!</strong><br /><br />

								Before you click FINALISE & SUBMIT, please go back to each page and be sure you’re happy with the information you’ve provided.  Once you click this button, the information is final and no further changes can be made.<br /><br />

								If you wish to return to this form and work on it again at a later date (before 20 June) simply log out now.<br />
							</ControlLabel>
						</Col>
					</FormGroup>

					<FormGroup className="agree">
						<Col sm={12}>
							<Checkbox name="BUMP_STATUS" value={true} onChange={this.handleInputChange} inline>I confirm that all building details are completed and correct</Checkbox>
						</Col>
					</FormGroup>

					<Button className="fg-submitButton" type="submit" disabled={this.state.BUMP_STATUS === false}>
						Finalise and Submit
						{ this.state.isSubmitting &&
							loader
						}
					</Button>

			</Form>
		)
	}
}
