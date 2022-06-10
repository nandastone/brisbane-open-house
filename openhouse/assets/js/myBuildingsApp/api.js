const api = window.myBuildingsApp;

export default {
	'NONCE_HEADER' : api.nonce_header,
	'LOGOUT_URL' : api.logout_url,
	'INTRO_ENDPOINT' : api.intro,
	'BUILDING_LIST_ENDPOINT' : api.building_list,
	'BUILDING_DETAILS_ENDPOINT' : api.building_details,
	'BUILDING_DETAILS_UPDATE_ENDPOINT' : api.building_details_update,
	'BUILDING_DETAILS_FIELDS_ENDPOINT' : api.building_form_fields,
	'BUILDING_STATUS_BUMP_ENDPOINT' : api.building_status_bump,
	'BUILDING_ADD_IMAGE_ENDPOINT' : api.building_add_image,
	'IMAGE_URL_BY_ID_ENDPOINT' : api.image_url_by_id,
	'BUILDING_ADD_FILE' : api.building_add_file,
	'ATTACHMENT_DETAILS' : api.attachment_by_id,
};
