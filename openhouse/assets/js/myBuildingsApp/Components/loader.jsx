import React from "react";

export default (props) => {

	let classes = 'loader';

	if (props.isInline) {
		classes += ' loader-inline';
	}
	return (
		<div className={classes}>
			<i className="fa fa-spinner fa-pulse"></i>
		</div>
	)
}
