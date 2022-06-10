import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

export default class PageIntro extends Component {

	htmlMarkup(html) {
		return {__html: html};
	}

	render() {
		const { title, paragraph } = this.props.pageIntro;
		return (
			<React.Fragment>
				{ (title.length > 0 || paragraph.length > 0) &&
					<Grid className="Intro-container">
						<Row>
							<Col xs={12} className="d-flex">
								{ (title.length > 0) &&
									<h1 className="title" dangerouslySetInnerHTML={this.htmlMarkup(title)} />
								}
							</Col>
							<Col xs={12} md={8} mdOffset={2}>
								{ (paragraph.length > 0) &&
									<div className="paragraph text-center" dangerouslySetInnerHTML={this.htmlMarkup(paragraph)} />
								}
							</Col>
						</Row>
					</Grid>
				}
			</React.Fragment>
		)
	}
}
