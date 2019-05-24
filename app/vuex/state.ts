export default {
	currUserIndex: -1,

	users: [{
		id: '477567',
		name: 'Monster Hunter'
	}],
    logs: [{
		id: '201915545',
		phone: '778-868-9999',
        client: 'John Stevenson',
        patient: 'Apple Pasta',
		relation: 'Dad',
        createdTime: '5:45 | 05/JAN/2019',
		timer: 0,
		status: true,
        progress: [[2, 3], [3, 5], [9, 12], [3, -1]]

    }, {
		id: '2018125145',
		phone: '778-868-8888',
        client: 'Michelle Gao',
        patient: 'Melon Pizza',
		relation: 'Mon',
        createdTime: '1:45 | 05/DEC/2018',
		timer: 0,
		status: false,// true,
		progress: [[2, 3], [3, 6]]// [[2, 3], [3, 6], [10, 14], [5, -1]]
    }, {
		id: '201712855',
		phone: '778-868-7777',
        client: 'Sara Lam',
        patient: 'Banana Hotdog',
		relation: 'Friend',
        createdTime: '5:05 | 08/DEC/2017',
		timer: 0,
		status: true,
        progress: [[2, 4], [11, 16], [7, -1]]
    }],




    data_version: 1,
    intro_question_id: 2,

    questions: [
		{
			"id": 1,
			"text": "Is Josh Beard-y?"
		},
		{
			"id": 2,
			"text": "Is this an old or new symptom?"
		},
		{
			"id": 3,
			"text": "Has the doctor/Nurse told you to expect this new symptom?"
		},
		{
			"id": 4,
			"text": "Is there a DNR in place?"
		},
		{
			"id": 5,
			"text": "Is there a DNR in place?"
		},
		{
			"id": 9,
			"text": "Question: Is there a DNR in place?"
		},
		{
			"id": 10,
			"text": "Question: Is there a DNR in place?"
		},
		{
			"id": 11,
			"text": "Is there a DNR in place?"
		}
    ],
    answers: [
		{
			"id": 1,
			"question_id": 1,
			"text": "Yes"
		},
		{
			"id": 2,
			"question_id": 1,
			"text": "No"
		},
		{
			"id": 3,
			"question_id": 2,
			"text": "New Symptom"
		},
		{
			"id": 4,
			"question_id": 2,
			"text": "Old Symptom"
		},
		{
			"id": 5,
			"question_id": 3,
			"text": "Yes –Expected symptom"
		},
		{
			"id": 6,
			"question_id": 3,
			"text": "No –Unexpected symptom"
		},
		{
			"id": 7,
			"question_id": 4,
			"text": "Yes"
		},
		{
			"id": 8,
			"question_id": 4,
			"text": "No"
		},
		{
			"id": 9,
			"question_id": 5,
			"text": "Yes"
		},
		{
			"id": 10,
			"question_id": 5,
			"text": "No"
		},
		{
			"id": 12,
			"question_id": 9,
			"text": "Yes"
		},
		{
			"id": 13,
			"question_id": 9,
			"text": "No"
		},
		{
			"id": 14,
			"question_id": 10,
			"text": "Yes"
		},
		{
			"id": 15,
			"question_id": 10,
			"text": "No"
		},
		{
			"id": 16,
			"question_id": 11,
			"text": "Yes"
		},
		{
			"id": 17,
			"question_id": 11,
			"text": "No"
		}
    ],
    branches: [
		{
			"id": 1,
			"question_id": 3,
			"answer_id": 3
		},
		{
			"id": 3,
			"question_id": 9,
			"answer_id": 5
		},
		{
			"id": 4,
			"question_id": 10,
			"answer_id": 6
		},
		{
			"id": 5,
			"question_id": 11,
			"answer_id": 4
		}
    ],
    intro_outcomes: [
		{
			"id": 3,
			"answer_id": 12,
			"text": "Expected Symptom Expected Death"
		},
		{
			"id": 4,
			"answer_id": 13,
			"text": "Expected Symptom Unexpected Death"
		},
		{
			"id": 5,
			"answer_id": 14,
			"text": "Unexpected Symptom Expected Death"
		},
		{
			"id": 6,
			"answer_id": 15,
			"text": "Unexpected Symptom Unexpected Death"
		},
		{
			"id": 7,
			"answer_id": 16,
			"text": "Expected Symptom Expected Death"
		},
		{
			"id": 8,
			"answer_id": 17,
			"text": "Expected Symptom Unexpected Death"
		}
    ],
    protocols: [
		{
			"id": 1,
			"name": "Nausea"
		},
		{
			"id": 2,
			"name": "Anxiety / Agitation"
		},
		{
			"id": 3,
			"name": "CADD Pump"
		},
		{
			"id": 4,
			"name": "Care Giver Distress"
		},
		{
			"id": 5,
			"name": "Constipation"
		},
		{
			"id": 6,
			"name": "Death"
		},
		{
			"id": 7,
			"name": "Dyspnea"
		},
		{
			"id": 8,
			"name": "Last Days"
		},
		{
			"id": 9,
			"name": "Last Hours"
		},
		{
			"id": 10,
			"name": "Pain"
		},
		{
			"id": 11,
			"name": "Terminal Bleed"
		}
    ]
};
