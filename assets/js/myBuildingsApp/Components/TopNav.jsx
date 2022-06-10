import React, {Component, Fragment} from "react";
import { Grid, Row, Col } from "react-bootstrap";
import Router, { HashRouter as Route, Link } from "react-router-dom";
import axios from 'axios';

function BackToDashboard() {
	return (
		<Fragment>
			<div className="Back">
				<Link to="/"><i className="d-inline-block fas fa-chevron-left"></i> <span className="d-inline-block ">Back to list</span></Link>
			</div>
		</Fragment>
	);
}

function LogoutNav({logoutURL}) {
	return (
		<Fragment>
			<div className="LogOut text-right">
				<a href={logoutURL}><span className="inline-block">Logout</span> <i className="inline-block fas fa-power-off"></i></a>
			</div>
		</Fragment>
	);
}

export default class TopNav extends Component {
	render() {
		const hasBackToList = this.props.hasBackToList;
		return (
			<Grid className="TopNav-container" fluid={true}>
				<Row>
					<Grid>
						<Row>
							<Col xs={12} sm={6}>
									{ hasBackToList &&
										<BackToDashboard />
									}
							</Col>
							<Col xs={12} sm={6}>
									<LogoutNav logoutURL={this.props.logoutURL} />
							</Col>
						</Row>
					</Grid>
				</Row>
			</Grid>
		)
	}
}
