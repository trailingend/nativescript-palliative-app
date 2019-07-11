import * as types from './mutation-types';

export default {
    [types.JSON_UPDATE](state, data){
        state.data_version = data.info.version;

        state.intro_questions = data.data.intro_questions;
        state.protocols = data.data.protocols;
        state.assessment_letters = data.data.assessment_letters;
        state.plans = data.data.plans;
    },

    [types.USER_CREATE](state, user) {
        state.currUserIdx = state.users.length;
        state.users.push(user);
    },
    [types.USER_UPDATE](state, user_idx) {
        state.currUserIdx = user_idx;
    },

    [types.LOG_CREATE](state, entry){
        state.logs.unshift(entry); 
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
        if (log_item.action === 'ADD') {
            state.logs[log_item.idx].intro_answers.push(log_item.content);
        } else if (log_item.action === 'CHANGE') {
            const ans_idx = state.logs[log_item.idx].intro_answers.findIndex(elem => { return elem.id == log_item.content.id; });
            state.logs[log_item.idx].intro_answers[ans_idx].a = log_item.content.a;
        } 
        console.log("=== in mutation forward ===");
        console.dir(state.logs[log_item.idx].intro_answers);
    },
    [types.INTRO_LOG_REVERT](state, log_idx){
        state.logs[log_idx].intro_progress.pop();
        console.log("in mutation backward ===: progress - " + state.logs[log_idx].intro_progress);
        console.log("in mutation backward ===: outcome - " + state.logs[log_idx].intro_outcome);
    },
    [types.INTRO_OUTCOME_UPDATE](state, outcome) {
        state.logs[outcome.idx].intro_outcome = outcome.id;
        console.log("in mutation outcome ===: outcome - " + state.logs[outcome.idx].intro_outcome);
    },
    [types.INTRO_OUTCOME_REVERT](state, log_idx) {
        state.logs[log_idx].intro_outcome = -1;
        console.log("in mutation outcome revert ===: outcome - " + state.logs[log_idx].intro_outcome);
    },
    [types.STATUS_UPDATE](state, log_id) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == log_id});
        state.logs[log_idx].status = state.logs[log_idx].status ? false : true;
        console.log("in mutation status ===: " + state.logs[log_idx].status);
    },
    [types.TIME_UPDATE](state, t){
        state.timer_value = t;
    },
    [types.TIMER_ON](state){
        state.timer_status = true;
    },
    [types.TIMER_OFF](state){
        state.timer_status = false;
    },

};