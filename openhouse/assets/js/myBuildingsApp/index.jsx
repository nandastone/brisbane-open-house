if (module.hot) {
  module.hot.accept();
}
/**********************************/

import './dashboard-forms';

import ReactDOM from 'react-dom';
import React, { Fragment, Component} from "react";
import axios from 'axios';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import api from './api';
import tabs from './tabs';

import TopNav from './Components/TopNav';
import BuildingList from './Components/BuildingList';
import UpdateBuilding from './Components/UpdateBuilding';

import PageIntro from './Components/PageIntro';
import Loader from './Components/loader';

class App extends Component {
	constructor(props) {
    super(props);
    this.state = {
			api: api,
			tabs: tabs,
			intro: {
				building_list_title: '',
				building_list_paragraph: '',
				building_form_title: '',
				building_form_paragraph: '',
			},
			fields: {},
			showConfirmationModal: false,
		};

		this.handleCloseConfirmationModal = this.handleCloseConfirmationModal.bind(this);
		this.handleShowConfirmationModal = this.handleShowConfirmationModal.bind(this);
	}

	handleShowConfirmationModal() {
		this.setState({ ...this.state, showConfirmationModal: true });
	}

	handleCloseConfirmationModal() {
		this.setState({ ...this.state, showConfirmationModal: false });
	}

	componentDidMount() {
		axios.defaults.headers.common['X-WP-Nonce'] = this.state.api.NONCE_HEADER;
		axios.all([
			axios.get(this.state.api.INTRO_ENDPOINT),
			axios.get(this.state.api.BUILDING_DETAILS_FIELDS_ENDPOINT + `?no-format=1`),
		])
			.then(axios.spread((introRes, fieldsRes) => {
				this.setState(
					{ ...this.state, intro: introRes.data, fields: fieldsRes.data },
					() => console.log('App cDM api loaded, state:', this.state)
				);
			}));
  }

	render() {
		return (
				<Router>
					<Switch>
						<Route
							exact path="/"
							render={ (props) => (
								<Fragment>
									<TopNav {...props} hasBackToList={false} logoutURL={this.state.api.LOGOUT_URL} />
									<PageIntro
										{...props}
										pageIntro={{
											title: this.state.intro.building_list_title,
											paragraph: this.state.intro.building_list_paragraph,
										}}
									/>

									<Modal show={this.state.showConfirmationModal} onHide={this.handleCloseConfirmationModal}>
										<Modal.Body className="text-center">Thank you for your submission. We will review the information provided and get back to you if required.</Modal.Body>
										<Modal.Footer>
											<Button className="btn-black btn-sm" onClick={this.handleCloseConfirmationModal}>
												Close
											</Button>
										</Modal.Footer>
									</Modal>

									<BuildingList api={ this.state.api } />
								</Fragment>
							) }
						/>
						<Route
							path={`/update/:id`}
							render={ (props) => (
								<Fragment>
									<TopNav {...props} hasBackToList={true} logoutURL={this.state.api.LOGOUT_URL} />
									<PageIntro
										{...props}
										pageIntro={{
											title: this.state.intro.building_form_title,
											paragraph: this.state.intro.building_form_paragraph,
										}}
									/>
									<UpdateBuilding
										{...props}
										tabs={ this.state.tabs }
										api={ this.state.api }
										fields={ this.state.fields }
										loader={<Loader />}
										handleShowConfirmationModal={this.handleShowConfirmationModal}
									/>
									{/*<BuildingUpdate {...props} api={ this.state.api } fields={ this.state.fields } />*/}
								</Fragment>
							) }
						/>
					</Switch>
				</Router>
		)
	}
}

const root = document.getElementById('root');

if ( root ) {
	ReactDOM.render(
		<App />,
		root
	);
}
