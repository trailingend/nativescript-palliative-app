export default {
	curr_user_idx: -1,
	curr_log_id: null,
	timer_value: 0,
	timer_status: false,

	users: [{
		id: '888888',
		name: 'Lesie Simon',
		shift_start: '7:00AM',
		shift_end: '5:00PM'
	}, {
		id: '477567',
		name: 'Ruby Chen',
		shift_start: '8:00AM',
		shift_end: '6:00PM'
	}],

	logs: 
	[{
		id: '201915545',
		phone: '7788095547',
        caller: 'Jihyun Lee',
        patient: 'Apple Pasta',
		relation: 'Friend',
		info: '27, no history',
        createdTime: '5:45 | JAN / 05 / 2019',
		status: true,
		progress: 0, // progress: 0 - intro, 1 - protocol, 2 - summary, 3 - submit
		intro_answers: [{
			id: 1,
			a: ["Yes", "Terrible"]
		}, {
			id: 2,
			a: ["Lots"]
		}, {
			id: 3,
			a: []
		}],
		items_answers: [],
		others_answers: [],
		plans_answers: [],
    }, {
		id: '2018125145',
		phone: '6045128638',
        caller: 'Ahssan Moshref',
        patient: 'Melon Pizza',
		relation: 'Friend',
		info: '88, no history',
        createdTime: '1:45 | DEC / 05 / 2018',
		status: false,
		progress: 0, // progress: 0 - intro, 1 - protocol, 2 - summary, 3 - submit
		intro_answers: [{
			id: 1,
			a: ["Yes", "Terrible"]
		}, {
			id: 2,
			a: ["Lots"]
		}, {
			id: 3,
			a: []
		}],
		items_answers: [],
		others_answers: [],
		plans_answers: [],
    }, {
		id: '201712855',
		phone: '7788836996',
        caller: 'Jayleen Zhou',
        patient: 'Orange Chicken',
		relation: 'Friend',
		info: '77, no history',
        createdTime: '5:05 | DEC / 08 /2017',
		status: false,
		progress: 0, // progress: 0 - intro, 1 - protocol, 2 - summary, 3 - submit
		intro_answers: [{
			id: 1,
			a: ["No", "Terrible"]
		}, {
			id: 2,
			a: ["Lots"]
		}, {
			id: 3,
			a: []
		}],
		items_answers: [],
		others_answers: [],
		plans_answers: [],
    }],



	data_version: 1,

	intro_questions: [],
	protocols: [],
	assessment_letters: [],
	plans: [],
};
