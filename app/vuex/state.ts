export default {
	curr_user_idx: -1,
	curr_log_id: null,
	timer_value: 0,
	timer_status: false,

	users: [{
		id: '477567',
		name: 'Monster Hunter',
		shift: '7:00AM'
	}, {
		id: '888888',
		name: 'Nomen Nescio',
		shift: '5:30PM'
	}],
	logs: 
	[{
		id: '201915545',
		phone: '7788095547',
        caller: 'Jihyun Lee',
        patient: 'Apple Pasta',
		relation: 'Friend',
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
		protocol_answers: [],

    }, {
		id: '2018125145',
		phone: '6045128638',
        caller: 'Ahssan Moshref',
        patient: 'Melon Pizza',
		relation: 'Friend',
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
		protocol_answers: [],
    }, {
		id: '201712855',
		phone: '7788836996',
        caller: 'Jayleen Zhou',
        patient: 'Orange Chicken',
		relation: 'Friend',
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
		protocol_answers: [],
    }],



	data_version: 1,

	intro_questions: [],
	protocols: [],
	assessment_letters: [],
	plans: [],
};
