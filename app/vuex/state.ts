export default {
	curr_user_idx: -1,
	curr_log_id: null,
	timer_value: 0,
	timer_status: false,

	users: 
	[{
		id: '888888',
		name: 'Lesie S.',
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
        caller: 'Jihyun Lee',
        client: 'Apple Pasta',
		relation: 'Friend',
		info: '27, no history',
		notes: 'notes here hhhh',
		nurse: '888888',
        createdTime: '5:45 | JAN / 05 / 2019',
		status: true,
		progress: [3, 3, -1, 1, 1], // progress: intro[step id], proto[protocol id], items[letter id], others[tri-state], plans[Bool]
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
        client: 'Melon Pizza',
		relation: 'Friend',
		info: '88, no history',
		notes: 'random notes',
		nurse: '888888',
        createdTime: '1:45 | DEC / 05 / 2018',
		status: false,
		progress: [3, 3, -1, 0, 0], // progress: intro[step id], proto[protocol id], items[letter id], others[tri-state], plans[Bool]
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
        client: 'Orange Chicken',
		relation: 'Friend',
		info: '77, no history',
		notes: '???',
		nurse: '477567',
        createdTime: '5:05 | DEC / 08 /2017',
		status: false,
		progress: [3, 3, -1, -1, 1], // progress: intro[step id], proto[protocol id], items[letter id], others[tri-state], plans[Bool]
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

	intro: [],
	protocols: [],
	assessment_letters: [],
	plans: [],
};
