import * as types from './mutation-types';

export default {
    [types.JSON_UPDATE](state, data){
        state.data_version = data.main.version;
        state.intro_question_id = data.main.intro_question_id;

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
    [types.USER_UPDATE](state, idx) {
        state.currUserIndex = idx;
    },

    [types.LOG_CREATE](state, entry){
        state.logs.push(entry); 
    },
    [types.LOG_DELETE](state, log_idx) {
        state.logs.splice(log_idx, 1);
    },
    [types.LOG_ACTIVATE](state, log_id) {
        state.currLogId = log_id;
    },
    [types.LOG_DEACTIVATE](state) {
        state.currLogId = null;
    },
    [types.INTRO_LOG_UPDATE](state, log_item){
        state.logs[log_item.idx].progress.push(log_item.q_and_a);
        console.log("in mutation uppdate ===: " + state.logs[log_item.idx].progress);
    },
    [types.INTRO_LOG_REVERT](state, log_idx){
        state.logs[log_idx].progress.pop();
        console.log("in mutation revert ===: " + state.logs[log_idx].progress);
    },
    [types.INTRO_OUTCOME](state, outcome) {
        state.logs[outcome.idx].progress.push([outcome.id, -1]);
        console.log("in mutation result ===: " + state.logs[outcome.idx].progress);
    },
    [types.STATUS_UPDATE](state, id) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == id});
        state.logs[log_idx].status = state.logs[log_idx].status ? false : true;
    }
    // [types.TIME_UPDATE](state, newTime){
    //     state.logs[log_idx].timer = newTime;
    // },

};