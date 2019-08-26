export default {
	curr_user_id: -1,
	timer: undefined,

	// users: [],
	// logs: [],

	users: 
	[{
		id: '888888',
		name: 'Leslie S.',
		fullname: 'Leslie Simon',
		shift_start: '9:00', 
		shift_end: '17:00', 
		color: '#7ca8ea',
	}, {
		id: '777777',
		name: 'Ruby C.',
		fullname: 'Ruby Chen',
		shift_start: '10:00',
		shift_end: '18:00', 
		color: '#a57ed7'
	}],

	logs: [{
		id: '1566600220489', 
		phone: '7788095547',
        caller: 'Jess Johnson',
        client: 'Karry Lee',
		relation: 'Friend',
		info: '87, high blood pressure',
		notes: 'sounds urgent',
		nurseID: '888888',
		nurseFullname: 'Leslie Simon',
		date: '18 Aug 2019',
		startTime: '05:45',
		endTime: '05:58',
		status: false,
		progress: [1, -2, 0, 0, 0, 0], // progress: intro[step id], proto[protocol id], items[Bool], others[Bool], plans[Bool], summary[Bool]
		editHistory: [],
		intro_answers: [{
			q_id: 4,
			a: ["Unconscious"]
		}, {
			q_id: 5,
			a: ["Yes", "Bleeding"]
		}],
		items_answers: [],
		others_answers: [],
		plans_answers: [],
    }, {
		id: '1566600264775',
		phone: '6045128638',
        caller: 'Ahssan Moshref',
        client: 'Machenzie Kingston',
		relation: 'Friend',
		info: '38, no history',
		notes: '',
		nurseID: '888888',
		nurseFullname: 'Leslie Simon',
		date: '17 Aug 2018',
		startTime: '01:45',
		endTime: '02:15',
		status: false,
		progress: [3, 3, 1, 0, 0, 0], // progress: intro[step id], proto[protocol id], items[Bool], others[Bool], plans[Bool], summary[Bool]
		editHistory: [],
		intro_answers: [{
			q_id: 4,
			a: ["Vomiting"]
		}, {
			q_id: 5,
			a: ["No", ""]
		}, {
			q_id: 6,
			a: ["No", ""]
		}, {
			q_id: 8,
			a: ["No", ""]
		}],
		items_answers: [{
			id: 3,
			a: [{
				"q_id": 12,
				"q_type": "single_select",
				"l_id": 3,
				"a": [
					"Yes  – vomit",
					""
				]
			}]
		}],
		others_answers: [],
		plans_answers: [],
    }, {
		id: '1566600289235',
		phone: '7788836996',
        caller: 'Sandy Benson',
        client: 'Jack Benson',
		relation: 'Daughter',
		info: '77, no history',
		notes: 'Ask about his breathing condition',
		nurseID: '777777',
		nurseFullname: 'Ruby Chen',
		date: '20 Aug 2019',
		startTime: '05:05',
		endTime: '05:20',
		status: true,
		progress: [3, 3, 1, 1, 1, 1], // progress: intro[step id], proto[protocol id], items[Bool], others[Bool], plans[Bool], summary[Bool]
		editHistory: [],
		intro_answers: [{
			q_id: 4,
			a: ["Cannot breathe"]
		}, {
			q_id: 5,
			a: ["No", ""]
		}, {
			q_id: 6,
			a: ["Yes", ""]
		}, {
			q_id: 7,
			a: ["Yes", ""]
		}, {
			q_id: 8,
			a: ["Yes", "On the desk"]
		}],
		items_answers: [{
			"id": 3,
			"a": [{
				"q_id": 10,
				"q_type": "single_select",
				"l_id": 1,
				"a": [
					"Yes – new symptom",
					"Happened 10 minutes ago"
				]
			}, {
				"q_id": 11,
				"q_type": "free_form",
				"l_id": 2,
				"a": [
					"No idea"
				]
			}, {
				"q_id": 12,
				"q_type": "single_select",
				"l_id": 3,
				"a": [
					"No  – no vomit",
					""
				]
			}, {
				"q_id": 13,
				"q_type": "single_select",
				"l_id": 3,
				"a": [
					"No – no nausea",
					""
				]
			}, {
				"q_id": 14,
				"q_type": "single_select",
				"l_id": 3,
				"a": [
					"No – not constipated",
					""
				]
			}, {
				"q_id": 16,
				"q_type": "scale",
				"l_id": 5,
				"a": [
					""
				]
			}, {
				"q_id": 21,
				"q_type": "free_form",
				"l_id": 8,
				"a": [
					"First time happending"
				]
			}]
		}],
		others_answers: [{
			"id": 3,
			"a": [{
				"q_id": 3,
				"q_type": "free_form",
				"a": [
					"Caller"
				]
			}, {
				"q_id": 4,
				"q_type": "boolean",
				"a": [
					"Yes",
					""
				]
			}, {
				"q_id": 5,
				"q_type": "boolean",
				"a": [
					"Yes",
					""
				]
			}, {
				"q_id": 6,
				"q_type": "free_form",
				"a": [
					"Not eating"
				]
			}, {
				"q_id": 9,
				"q_type": "boolean",
				"a": [
					"Yes",
					""
				]
			}]
		}],
		plans_answers: [
			"Reach out for medical support (e.g. MRP)",
			"Recommend going to UPCC (Urgent Primary Care Center)* if appropriate and unable to manage symptoms at home and if ambulatory and within client’s goals of care",
			""
		],
    }],



	tutorials: [{
			title: 'Create New Client',
			video: 'help1',
			desc: 'Tap on ‘New Client’ on the bottom of the Dashboard screen to start. Even unfinished documentation will be saved in ‘Client History’. If another client calls, you can pause your current documentation to answer the new call.'
		}, {
			title: 'Access Client History',
			video: 'help2',
			desc: 'Access your Client History on the home-screen. Arrow with semi-circle indicates incomplete documenting. Checkmark indicates documenting is complete and sent. Tap the document to open where you left off and continue.'
		}, {
			title: 'Document',
			video: 'help3',
			desc: 'You have the option of free text and multiple choice to assist with documentation. To help navigate the assessment you can skip, go-back or forward. The ‘Recommend’ section is to support you with more info.'
		}, {
			title: 'Review Summary Screen',
			video: 'help4',
			desc: 'This screen is a final review of your documentation. Tap the pencil icon to access any section of the document. Tick the box “Documentation reviewed and finalized”.'
		}, {
			title: 'Uploading to PARIS',
			video: 'help5',
			desc: 'TBD.'
		}, {
			title: 'Delete Document',
			video: 'help2',
			desc: 'TBD'
	}],



	data_version: 0,

	intro: [],
	protocols: [],
	assessment_letters: [],
	plans: [],
};
