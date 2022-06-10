import React, { Component, Fragment } from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Grid, Row, Col, Button } from "react-bootstrap";
import styled from "styled-components";
import slugify from 'slugify';
import axios from 'axios';
import { Html5Entities } from 'html-entities';
const htmlEntities = new Html5Entities();

import Loader from './loader';

const Image = styled.div`
    background-image: url('${props => props.img}');
`;

export default class BuildingList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			buildings: [],
		}
	}

	componentDidMount() {
		axios.defaults.headers.common['X-WP-Nonce'] = this.props.api.NONCE_HEADER;
    axios.get(this.props.api.BUILDING_LIST_ENDPOINT)
      .then(res => {
				const buildings = res.data.buildings;
				// console.log('buildings api response', buildings)
				this.setState({ ...this.state, buildings: buildings, isLoading: false });
				// console.log('after setState', this.state)
			});
	}

	render() {
		// console.log('current state BuildingList', this.state);
		const { buildings } = this.state;
		let content;
		if ( true === this.state.isLoading ) {
			content =
					<React.Fragment>
						<Row>
							<Col xs={12}>
								<Loader />
							</Col>
						</Row>
					</React.Fragment>;
		} else {
			// it has loaded
			if ( buildings.length < 1 ) {
				content = <Fragment>
					<Row>
						<Col xs={12}>
							<p className="text-center">
								<strong>Sorry, it seems no building was assigned to you yet.</strong>
							</p>
						</Col>
					</Row>
				</Fragment>
			} else {
				content = Object.keys(buildings).map(buildingId => {
					return (
						<Fragment
							key={buildingId}
						>
							<Row>
								<Col className="spacer" md={10} mdOffset={1}>
								</Col>
							</Row>
							<Row
								className="BuildingItem-row d-md-flex align-items-center"
							>
								<Col xs={12} md={2} mdOffset={1}>
									<Image className="meta meta-image" img={buildings[buildingId].image} />
								</Col>
								<Col xs={12} md={4}>
									<h2 className="meta meta-name">{htmlEntities.decode(buildings[buildingId].name)}</h2>
								</Col>
								<Col xs={12} md={2}>
									<div>
										<p className={`meta meta-status ${slugify(buildings[buildingId].status).toLowerCase()}`}>{buildings[buildingId].status}</p>
									</div>
								</Col>
								<Col xs={12} md={2}>
									{
										('submitted' === buildings[buildingId].status.toLowerCase() || 'approved' === buildings[buildingId].status.toLowerCase()) ?
											(
												<div className="meta meta-update-button">
													<Button disabled={true}>
														Update Details
													</Button>
												</div>
											) : (
												<Link
													className="meta meta-update-button"
													to={`/update/${buildingId}`}
												>
													<Button>
														Update Details
													</Button>
												</Link>
											)
									}
								</Col>
							</Row>
						</Fragment>
					);
				});
			}
		}
		return (
			<Grid className="BuildingList-container">
				{content}
			</Grid>
		);
	}
}
