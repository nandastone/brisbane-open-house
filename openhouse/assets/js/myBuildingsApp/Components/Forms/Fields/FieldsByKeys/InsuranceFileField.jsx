import React, {useCallback, useState, useEffect } from 'react'
import {useDropzone} from 'react-dropzone'
import {
	FormControl,
	FormGroup,
	ControlLabel,
	Row,
	Col,
} from "react-bootstrap";
import axios from 'axios';

export default props => {
	const {index} = props;
	const maxSize =  10485760; // 10 MB


	const [fileId, setFileId] = useState(props?.value || null);
	const [fileName, setFileName] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);

	const [isUploading, setIsUploading] = useState(false);
	const [percentCompleted, setpercentCompleted] = useState(0);

	const upload = (file) => {
		setIsUploading(true);
		setpercentCompleted(0);
		const {api, buildingId, handleUploadFile, prependFieldName, valueFieldName, index} = props;
		// const name = prependFieldName + field.key;
		const name = valueFieldName;
		// console.log('props.prependFieldName + props.field.key', props.prependFieldName + props.field.key);
		let payload = new FormData();
		payload.append('file', file);

		const config = {
			onUploadProgress: function(progressEvent) {
				let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
				setpercentCompleted(percentCompleted - 2);
			}
		};

		axios.defaults.headers.common['X-WP-Nonce'] = api.NONCE_HEADER;
		axios
			.post(
				api.BUILDING_ADD_FILE + buildingId,
				payload,
				config
			)
			.then(res => {
				const response = res.data;
				// console.log("we got:", response);
				const id = response.output.attachment.id;
				const fileName = response.output.attachment.name;
				setpercentCompleted(99);
				setFileId(id);
				setFileName(fileName);
				setpercentCompleted(100);
				setIsUploading(false);
				handleUploadFile(props.field.key, id);
			});
	};

	const removeAttachment = () => {
		const {handleUploadFile, index} = props;
		handleUploadFile(props.field.key, null, 'remove');
		setFileId(null);
		setIsUploading(false);
		setpercentCompleted(0);
	};


	const getAttachmentDetails = attachment_id => {
		const {api} = props;
		axios.defaults.headers.common['X-WP-Nonce'] = api.NONCE_HEADER;
		axios
			.post(
				api.ATTACHMENT_DETAILS + attachment_id, {}
			)
			.then(res => {
				const response = res.data;
				// console.log("we got:", response);
				setFileName(res.data.output.attachment_name);
				// setHasImage(true);
				// assuming the submission was processed.

				// setIsUploading(false);
			});
	};

	const onDrop = useCallback(acceptedFiles => {

		const file = acceptedFiles[0];
		setFileName(file.name);
		upload(file);

	}, []);

	const {isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, rejectedFiles} = useDropzone({
		onDrop,
		accept: 'image/jpeg, image/png, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		minSize: 0,
		maxSize, // 10 MB
	});

	// check if file is too large.
	const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;

	// messages.
	const dragRejectMessage = <p>File type not accepted!</p>;
	const dragRejectFileTooBig = <p>File is too large! Please use file less than 10MB in size.</p>;

	useEffect(() => {
		if (fileId) {
			getAttachmentDetails(fileId);
		}
	}, []);

	return (
		<div className="my-5rem">

			<FormGroup controlId={`image-${index + 1}`} className="ImageField required">
				<Col componentClass={ControlLabel} md={4}>
					{props.field.label}
				</Col>
				<Col md={8} className="Image-dropzone">

					{ isUploading &&
					<Row className="upload-inprogress">
						<Col sm={4}>
							{fileName}
						</Col>
						<Col sm={8}>
							<div className="progress">
								<div className="progress-bar progress-bar-warning progress-bar-striped" role="progressbar" aria-valuenow={`${percentCompleted}`} aria-valuemin="0"
										 aria-valuemax="100" style={ {width: `${percentCompleted}%`} }>
									{percentCompleted}%
								</div>
							</div>
						</Col>
					</Row>
					}

					{
						(!fileId && !isUploading) &&
						<div {...getRootProps()} className="dropzone">
							<p style={{ paddingTop: '2rem' }}>
								Drop file here or <span>browse</span><br />
								Accepted: .jpg, .png, .pdf, .doc
							</p>
							{isDragReject && dragRejectMessage}
							{isFileTooLarge && dragRejectFileTooBig}
							<input {...getInputProps()} required={true} multiple={false} style={{ display: 'block !important', zIndex: '-1' }} />
						</div>
					}

					{
						(fileId && fileName) &&
						<Row className="upload-done">
							<Col sm={10}>
								{fileName}
							</Col>
							<Col sm={2}>
								<i className="delete fas fa-trash-alt" onClick={removeAttachment}>&nbsp;</i>
							</Col>
						</Row>
					}

				</Col>
			</FormGroup>

		</div>
	)
};
