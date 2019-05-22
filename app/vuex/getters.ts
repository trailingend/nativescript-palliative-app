export default {
    questions: state => state.questions,
    answers: state => state.answers,
    branches: state => state.branches,
    intro_outcomes: state => state.intro_outcomes,
    protocols: state => state.protocols,
    
    logs: state => state.logs,
    intro_question_id: state => state.intro_question_id,
    currLogIndex: state => state.currLogIndex
};