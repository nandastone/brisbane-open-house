export default [
	{
		key: 'BUILDING_AND_CONTACT_DETAILS',
		name: 'BUILDING AND CONTACT DETAILS',
		isSaved: false,
		description: '',
		fields: {
			'WORDPRESS_POST_TITLE': { required: true }, // Building Name,
			'field_5b555f4bf6e67': { required: true }, // Building Address,
			'field_5b5543fb965b0': { required: true }, // Delivery Address,
			'field_5b55440b965b1': { required: true, max: 2, firstIsRequired: true, shouldAppendWithCount: true }, // Contact (Repeater)

		},
	},
	{
		key: 'TOURS_AND_BUILDING_ACCESS',
		name: 'TOURS AND BUILDING ACCESS',
		isSaved: false,
		description: '',
		fields: {
			'field_5ca6f467dcaed': { required: true }, // What days will you be open for BOH
			'field_62a06a74a9626': { required: false }, // Text field appears when other day is selected
			'field_5caae315ec23c': { required: false }, // Saturday 12th 2019 Opening Hours
			'field_5cac85c49acb3': { required: false }, // Sunday 13th 2019 Opening Hours
			'field_5b5556ab03a05': { required: true }, // Type of access
			'field_5b55576803a06': { required: false, isRightAlignLabel: true }, // Type of access other
			'field_5b5666f19561d': { required: false }, // Times or frequency of guided tours
			'field_5cabf2fc71031': { required: true }, // Tour tips
			'field_5cabf7c469ed2': { required: false, isRightAlignLabel: true }, // Tour tips others
			'field_5cabf84669ed4': { required: true }, // GUIDED_TOURS_ON_SUN_SAT
			'field_5cabf85f69ed5': { required: false }, // GUIDED_TOURS_ON_SUN_SAT_NO
			'field_5cabf89e69ed6': { required: true }, // FK_ADDITIONAL_ACTIVITIES_WEEKEND_BOOL
			'field_5cabf8b969ed7': { required: false }, // FK_ADDITIONAL_ACTIVITIES_WEEKEND
			'field_5cabf8ef69ed8': { required: false, isRightAlignLabel: true }, // FK_ADDITIONAL_ACTIVITIES_WEEKEND_OTHER
			'field_5cabf7e969ed3': { required: false }, // Dress Requirements
			'field_5b5670cf9b1ae': { required: true }, // Wheelchair access
		}
	},
	{
		key: 'STAFFING',
		name: 'STAFFING',
		isSaved: false,
		description: 'Building owners must provide their own representatives to run tours or facilitate detailed activities.  If needed, BOH can provide a limited number of volunteers to assist with general duties such as managing queues, counting visitors and greeting guests.',
		fields: {
			'field_5cac415211938': { required: true }, // Would you like to apply for volunteers?
		}
	},
	{
		key: 'PREBOOKED_BUILDINGS',
		name: 'PRE-BOOKED BUILDINGS',
		isSaved: false,
		description: 'Each year there are a number of pre-booked buildings in the program.  We prefer to limit pre-booked buildings to avoid disappointing visitors.  However, we acknowledge pre-booking is appropriate for private homes and special heritage buildings.',
		fields: {
			'field_5cac43b5e7c32': { required: true }, // Should building be pre-booked
			'field_5cac43cae7c33': { required: false }, // Tour maximum capacity
		}
	},
	{
		key: 'DETAILS_ABOUT_YOUR_BUILDING',
		name: 'DETAILS ABOUT YOUR BUILDING',
		isSaved: false,
		description: '',
		fields: {
			'field_5b4bfd944a5c9': { required: false }, // Architect/s
			'field_5cb40d7cb1a22': { required: false }, // Refurbishment or additional architects
			'field_5b4bfd094a5c8': { required: true }, // Year built
			'field_5b555e5b4f01b': { required: false }, // Architectural awards
			'field_5cac809e03e7f': { required: false }, // Environmental accreditation
			'field_5b4bfdbb4a5ca': { required: false }, // Website
			'field_5b555e774f01c': { required: true }, // Is Heritage listed?
		}
	},
	{
		key: 'BUILDING_DESCRIPTION',
		name: 'BUILDING DESCRIPTION',
		isSaved: false,
		description: 'This text will appear on our website.  Include any interesting facts about the building.  Consider features of historical, cultural and architectural significance and any quirky facts.  Approx 200 words required.',
		fields: {
			'WORDPRESS_POST_CONTENT': { required: true, noLabel: true }, // Building Description,
		}
	},
	{
		key: 'INSURANCE',
		name: 'INSURANCE',
		isSaved: false,
		description: 'BOH cannot assume liability for any injuries to building visitors or to employees, tenants or guests of building owners or theft, damage or loss to personal or real property that may occur during the BOH event.  Building owners, tenants and lessees are required to have adequate public liability insurance and building contents insurance.',
		fields: {
			'field_5cac821b3a483': { required: true }, // Has Insurance
			'field_5b555bb7097d8': { required: true }, // Insurance Expiry date
			'field_5cac82913a484': { required: true }, // Insurance Expiry file
		}
	},
	{
		key: 'PHOTOGRAPHS',
		name: 'PHOTOGRAPHS',
		isSaved: false,
		description: 'Photographs of your building will appear in the BOH Guide Book, website and promotional material. Please supply 3-5 high resolution images (portrait and landscape). Use this image naming protocol:  BuildingName_PhotographerName.',
		fields: {
			// 'field_5cac831c2a1cf': { required: true }, // Image to use
			'field_5cac834f2a1d0': { required: false, max: 5 }, // Images
		}
	},
	{
		key: 'OTHER_INFORMATION',
		name: 'OTHER INFORMATION',
		isSaved: false,
		description: '',
		fields: {
			'field_5cac851a43b82': { required: false }, // Other information
		}
	},
	{
		key: 'FINALISE_AND_SUBMIT',
		name: 'FINALISE AND SUBMIT',
		isSaved: false,
		description: 'Terms and conditions lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a ornare neque suspendisse potenti, nam vitae tellus quis ipsum et rhoncus tincidunt. Sed tristique cursus pharetra team consent.',
	},
];
