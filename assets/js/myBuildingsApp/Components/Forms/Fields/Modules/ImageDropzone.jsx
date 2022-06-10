import React, {useCallback, useState, useEffect } from 'react'
import {useDropzone} from 'react-dropzone'
import {
	Form,
	FormControl,
	FormGroup,
	ControlLabel,
	HelpBlock,
	Grid,
	Row,
	Col,
	Checkbox,
	Button,
	OverlayTrigger,
	Tooltip,
	Alert,
	Radio
} from "react-bootstrap";
import axios from 'axios';

export default (props) =>  {
	// console.log('ImageDropzone props', props);
	// const fieldName = props.prependFieldName + props.field.key;
	const fieldName = props.valueFieldName;

	const [previewImage, setPreviewImage] = useState(null);

	// const [hasImage, setHasImage] = useState(false);

	const [isUploading, setIsUploading] = useState(false);

	const [percentCompleted, setpercentCompleted] = useState(0);

	const [imageId, setImageId] = useState(props.value);
	const [imageUrl, setImageUrl] = useState(null);

	const maxSize =  10485760; // 10 MB
	// const maxSize =  1048576; // 1 MB

	const onDrop = useCallback(acceptedFiles => {
		const file = acceptedFiles[0];
		const reader = new FileReader();

		// console.log('acceptedFiles[0]', file);
		reader.readAsDataURL(file);

		reader.onabort = () => console.log('file reading was aborted');
		reader.onerror = () => console.log('file reading has failed');
		reader.onload = () => {
			const dataImageURL = reader.result;
			setPreviewImage(dataImageURL);
			// setHasImage(true);
			uploadImage(file);
		};
	}, []);

	useEffect(() => {
		if (imageId) {
			getImageUrl(imageId);
		}
	}, []);

	const getImageUrl = image_id => {
		const {api} = props;
		axios.defaults.headers.common['X-WP-Nonce'] = api.NONCE_HEADER;
		axios
			.post(
				api.IMAGE_URL_BY_ID_ENDPOINT + image_id, {}
			)
			.then(res => {
				const response = res.data;
				console.log("we got:", response);
				setImageUrl(res.data.output.image_url);
				// setHasImage(true);
				// assuming the submission was processed.

				// setIsUploading(false);
			});
	};

	const uploadImage = (image) => {
		setIsUploading(true);
		setpercentCompleted(0);
		const {api, buildingId, handlePhotographAddedImage, prependFieldName, valueFieldName, index} = props;
		// const name = prependFieldName + field.key;
		const name = valueFieldName;
		// console.log('props.prependFieldName + props.field.key', props.prependFieldName + props.field.key);
		let payload = new FormData();
		payload.append('file', image);

		const config = {
			onUploadProgress: function(progressEvent) {
				let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
				setpercentCompleted(percentCompleted);
				// console.log('percentCompleted', percentCompleted);
			}
		};

		axios.defaults.headers.common['X-WP-Nonce'] = api.NONCE_HEADER;
		axios
			.post(
				api.BUILDING_ADD_IMAGE_ENDPOINT + buildingId,
				payload,
				config
			)
			.then(res => {
				const response = res.data;
				console.log("we got:", response);
				const resImageId = response.output.image.id;
				setImageId(resImageId);
				getImageUrl(resImageId);
				setIsUploading(false);
				handlePhotographAddedImage(resImageId, index, 'add');
				// setHasImage(true);
				// assuming the submission was processed.
			});
	};

	const removeImage = () => {
		const {api, buildingId, handlePhotographAddedImage, prependFieldName, valueFieldName, i} = props;
		handlePhotographAddedImage("", i, 'remove');
		setImageId(null);
		setImageUrl(null);
		setIsUploading(false);
	};

	const {isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, rejectedFiles} = useDropzone({
		onDrop,
		accept: 'image/jpeg, image/png',
		minSize: 0,
		maxSize, // 10 MB
	});

	const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;

	// messages.
	const dragRejectMessage = <p>File type not accepted! .png and .jpg images are only allowed.</p>;
	const dragRejectFileTooBig = <p>File is too large! Please use file less than 10MB in size.</p>;

	// console.log('previewImage', previewImage);

	return (
		<div className="Image-dropzone">
			{ isUploading &&
				<Row className="upload-inprogress">
					<Col sm={4}>
						<img src={previewImage} alt=""/>
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
			{ (!imageId && !isUploading) &&
				<div {...getRootProps()} className="dropzone">
					<input {...getInputProps()} />
					<p>Drop image here or <span>browse</span></p>
					{isDragReject && dragRejectMessage }
					{ isFileTooLarge && dragRejectFileTooBig }
				</div>
			}
			{
				imageId &&
				<Row className="upload-done">
					<Col sm={10}>
						<img src={imageUrl} alt=""/>
					</Col>
					<Col sm={2}>
						<i className="delete fas fa-trash-alt" onClick={removeImage}>&nbsp;</i>
					</Col>
				</Row>
			}
			<input type="hidden" value={imageId} />
		</div>
	)
}
