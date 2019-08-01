export default {
	curr_user_idx: -1,
	curr_log_id: null,
	timer_value: 0,
	timer_status: false,

	users: 
	[{
		id: '888888',
		name: 'Leslie S.',
		shift_start: '9:00', //'7:00AM',
		shift_end: '17:00', // '5:00PM',
		color: '#7ca8ea',
	}, {
		id: '777777',
		name: 'Ruby C.',
		shift_start: '10:00',//'8:00AM',
		shift_end: '18:00', //'6:00PM',
		color: '#a57ed7'
	}],

	logs: //[],
	[{
		id: '201915545',
		phone: '7788095547',
        caller: 'Jess Johnson',
        client: 'Karry Lee',
		relation: 'Friend',
		info: '87, high blood pressure',
		notes: 'sounds urgent',
		nurse: '888888',
        createdTime: '5:45 | JAN / 05 / 2019',
		status: false,
		progress: [1, -1, -1, -1, 0], // progress: intro[step id], proto[protocol id], items[letter id], others[tri-state], plans[Bool]
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
		id: '2018125145',
		phone: '6045128638',
        caller: 'Ahssan Moshref',
        client: 'Machenzie Kingston',
		relation: 'Friend',
		info: '38, no history',
		notes: '',
		nurse: '888888',
        createdTime: '1:45 | DEC / 05 / 2018',
		status: false,
		progress: [3, 3, -1, -1, 0], // progress: intro[step id], proto[protocol id], items[letter id], others[tri-state], plans[Bool]
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
		id: '201712855',
		phone: '7788836996',
        caller: 'Sandy Benson',
        client: 'Jack Benson',
		relation: 'Daughter',
		info: '77, no history',
		notes: 'Ask about his breathing condition',
		nurse: '777777',
        createdTime: '5:05 | DEC / 08 /2017',
		status: true,
		progress: [3, 3, 3, -1, 1], // progress: intro[step id], proto[protocol id], items[letter id], others[tri-state], plans[Bool]
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



	data_version: 1,

	intro: [],
	protocols: [],
	assessment_letters: [],
	plans: [],
};
