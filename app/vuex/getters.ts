export default {
    currUserIdx: state => state.currUserIdx,
    currLogId: state => state.currLogId,
    timer_value: state => state.timer_value,
    timer_status: state => state.timer_status,
    logs: state => state.logs,
    users: state => state.users,

    phase_2_question_id: state => state.phase_2_question_id,
    phase_3_question_id: state => state.phase_3_question_id,
    pre_protocol_answer: state => state.pre_protocol_answer,
	pre_protocol_question: state => state.pre_protocol_question,
    questions: state => state.questions,
    answers: state => state.answers,
    branches: state => state.branches,
    intro_outcomes: state => state.intro_outcomes,
    protocols: state => state.protocols
};