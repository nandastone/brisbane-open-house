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
	const {index, setSubmittingState} = props;
	const maxSize =  10485760; // 10 MB


	const [imageId, setImageId] = useState(props?.value?.imageId || null);
	const [imageUrl, setImageUrl] = useState(null);
	const [imageCredit, setImageCredit] = useState( props?.value?.imageCredit || null );

	const [previewImage, setPreviewImage] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [percentCompleted, setpercentCompleted] = useState(0);

	const uploadImage = (image, photographersName) => {
		setIsUploading(true);
		setSubmittingState(true);
		setpercentCompleted(0);
		const {api, buildingId, handlePhotographAddedImage, prependFieldName, valueFieldName, index} = props;
		// const name = prependFieldName + field.key;
		const name = valueFieldName;
		// console.log('props.prependFieldName + props.field.key', props.prependFieldName + props.field.key);
		let payload = new FormData();
		payload.append('image', image);
		payload.append('imageCredit', photographersName);

		const config = {
			onUploadProgress: function(progressEvent) {
				let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
				setpercentCompleted(percentCompleted - 2);
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
				// console.log("we got:", response);
				const resImageId = response.output.image.id;
				setpercentCompleted(99);
				setImageId(resImageId);
				getImageUrl(resImageId);
				setpercentCompleted(100);
				setIsUploading(false);
				setSubmittingState(false);
				handlePhotographAddedImage({imageId: resImageId, imageCredit: photographersName}, index, 'add');
				// setHasImage(true);
				// assuming the submission was processed.
			});
	};

	const getImageUrl = image_id => {
		const {api} = props;
		axios.defaults.headers.common['X-WP-Nonce'] = api.NONCE_HEADER;
		axios
			.post(
				api.IMAGE_URL_BY_ID_ENDPOINT + image_id, {}
			)
			.then(res => {
				const response = res.data;
				// console.log("we got:", response);
				setImageUrl(res.data.output.image_url);
				// setHasImage(true);
				// assuming the submission was processed.

				// setIsUploading(false);
			});
	};

	const removeImage = () => {
		const {handlePhotographAddedImage, index} = props;
		handlePhotographAddedImage("", index, 'remove');
		setImageId(null);
		setImageUrl(null);
		setImageCredit(null);
		setIsUploading(false);
		setpercentCompleted(0);
	};

	const onDrop = useCallback(acceptedFiles => {

		const photographerName = prompt( "Please give credit by entering Photographer's name" );

		if ( photographerName.length > 0 ) {
			setImageCredit(photographerName);
		} else {
			acceptedFiles = [];
			return;
		}

		const file = acceptedFiles[0];
		const reader = new FileReader();

		// console.log('acceptedFiles[0]', file);
		reader.readAsDataURL(file);

		// reader.onabort = () => console.log('file reading was aborted');
		// reader.onerror = () => console.log('file reading has failed');
		reader.onload = () => {
			const dataImageURL = reader.result;

			setPreviewImage(dataImageURL);
			uploadImage(file, photographerName);
		};
	}, []);

	const {isDragActive, getRootProps, getInputProps, isDragReject, acceptedFiles, rejectedFiles} = useDropzone({
		onDrop,
		accept: 'image/jpeg, image/png',
		minSize: 0,
		maxSize, // 10 MB
	});

	// check if file is too large.
	const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;

	// messages.
	const dragRejectMessage = <p>File type not accepted! .png and .jpg images are only allowed.</p>;
	const dragRejectFileTooBig = <p>File is too large! Please use file less than 10MB in size.</p>;

	useEffect(() => {
		if (imageId) {
			getImageUrl(imageId);
		}
	}, []);

	return (
		<div className="my-5rem">

			<FormGroup controlId={`image-${index + 1}`} className="ImageField">
				<Col componentClass={ControlLabel} md={4}>
					Image {index + 1}
				</Col>
				<Col md={8} className="Image-dropzone">

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

					{
						(!imageId && !isUploading) &&
						<div {...getRootProps()} className="dropzone">
							<input {...getInputProps()} />
							<p>Drop image here or <span>browse</span></p>
							{isDragReject && dragRejectMessage}
							{isFileTooLarge && dragRejectFileTooBig}
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

				</Col>
			</FormGroup>

			{ imageCredit &&
				<FormGroup controlId={`image-credit-${index + 1}`} className="ImageField">
					<Col componentClass={ControlLabel} md={4}>
						Image Credit {index + 1}
					</Col>
					<Col md={8} className="Image-credit">
						<FormControl
							type="text"
							value={imageCredit}
							disabled={true}
						/>
					</Col>
				</FormGroup>
			}

		</div>
	)
};
