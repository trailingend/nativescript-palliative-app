import * as types from './mutation-types';

export default {
    [types.JSON_UPDATE](state, data){
        state.data_version = data.main.version;
        state.phase_2_question_id = data.main.phase_2_question,
        state.phase_3_question_id = data.main.phase_3_question,
        state.pre_protocol_question = data.main.pre_protocol_question,

        state.questions = data.questions;
        state.answers = data.answers;
        state.branches = data.branches;
        state.intro_outcomes = data.intro_outcomes;
        state.protocols = data.protocols;
    },

    [types.USER_CREATE](state, user) {
        state.currUserIndex = state.users.length;
        state.users.push(user);
    },
    [types.USER_UPDATE](state, user_idx) {
        state.currUserIndex = user_idx;
    },

    [types.LOG_CREATE](state, entry){
        state.logs.push(entry); 
    },
    [types.LOG_DELETE](state, log_idx) {
        state.logs.splice(log_idx, 1);
    },
    [types.LOG_INFO_UPDATE](state, entry) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == entry.id});
        state.logs[log_idx].phone = entry.phone;
        state.logs[log_idx].client = entry.client;
        state.logs[log_idx].patient = entry.patient;
        state.logs[log_idx].relation = entry.relation;
    },
    [types.LOG_ACTIVATE](state, log_id) {
        state.currLogId = log_id;
    },
    [types.LOG_DEACTIVATE](state) {
        state.currLogId = null;
    },
    [types.INTRO_LOG_UPDATE](state, log_item){
        state.logs[log_item.idx].intro_progress.push(log_item.q_and_a);
        console.log("in mutation forward ===: progress - " + state.logs[log_item.idx].intro_progress);
    },
    [types.INTRO_LOG_REVERT](state, log_idx){
        state.logs[log_idx].intro_progress.pop();
        console.log("in mutation backward ===: progress - " + state.logs[log_idx].intro_progress);
        console.log("in mutation backward ===: outcome - " + state.logs[log_idx].intro_outcome);
    },
    [types.INTRO_OUTCOME](state, outcome) {
        state.logs[outcome.idx].intro_outcome = outcome.id;
        console.log("in mutation outcome ===: outcome - " + state.logs[outcome.idx].intro_outcome);
    },
    [types.STATUS_UPDATE](state, log_id) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == log_id});
        state.logs[log_idx].status = state.logs[log_idx].status ? false : true;
        console.log("in mutation status ===: " + state.logs[log_idx].status);
    }
    // [types.TIME_UPDATE](state, newTime){
    //     state.logs[log_idx].timer = newTime;
    // },

};