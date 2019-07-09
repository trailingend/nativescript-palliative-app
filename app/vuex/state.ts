export default {
	currUserIdx: -1,
	currLogId: null,
	timer_value: 0,
	timer_status: false,

	users: [{
		id: '477567',
		name: 'Monster Hunter',
		shift: '7:00AM'
	}],
	logs: 
	[{
		id: '201915545',
		phone: '7788095547',
        client: 'Jihyun Lee',
        patient: 'Apple Pasta',
		relation: 'Friend',
        createdTime: '5:45 | 05/JAN/2019',
		timer: 0,
		status: true,
		intro_progress: [[2, 3], [3, 5], [9, 12], [16, 26]],
		intro_outcome: 3,
		intro_action: -1,
		protocol_id: -1,

    }, {
		id: '2018125145',
		phone: '6045128638',
        client: 'Ahssan Moshref',
        patient: 'Melon Pizza',
		relation: 'Friend',
        createdTime: '1:45 | 05/DEC/2018',
		timer: 0,
		status: false,// true,
		intro_progress: [[2, 3], [3, 6]],
		intro_outcome: -1,
		intro_action: -1,
		protocol_id: -1,
    }, {
		id: '201712855',
		phone: '7788836996',
        client: 'Jayleen Zhou',
        patient: 'Orange Chicken',
		relation: 'Friend',
        createdTime: '5:05 | 08/DEC/2017',
		timer: 0,
		status: false,
		intro_progress: [[2, 4], [11, 16]],
		intro_outcome: 7,
		intro_action: -1,
		protocol_id: -1,
    }],



	data_version: 1,

	intro_questions: [],
	protocols: [],
	assessment_letters: [],
	plans: [],
};
