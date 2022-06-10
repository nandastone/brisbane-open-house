import React from "react";
import { Prompt } from 'react-router'

export default (props) => {
	const {when} = props;
	return (
		<Prompt
			when={when}
			message="You have unsaved changes, are you sure you want to leave?"
		/>
	)
}
