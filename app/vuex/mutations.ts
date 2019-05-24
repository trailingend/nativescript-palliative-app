import * as types from './mutation-types';

export default {
    [types.JSON_UPDATE](state, data){
        state.questions = data.questions;
        state.answers = data.answers;
        state.branches = data.branches;
        state.intro_outcomes = data.intro_outcomes;
        state.protocols = data.protocols;
    },

    [types.NEW_USER](state, user) {
        state.currUserIndex = state.users.length;
        state.users.push(user);
    },
    [types.USER_UPDATE](state, idx) {
        state.currUserIndex = idx;
    },

    [types.NEW_LOG](state, entry){
        state.logs.push(entry); 
    },
    [types.INTRO_LOG_UPDATE](state, log_item){
        state.logs[log_item.idx].progress.push(log_item.q_and_a);
    },
    [types.INTRO_LOG_REVERT](state, log_idx){
        state.logs[log_idx].progress.pop();
        console.log("in mutation ===: " + state.logs[log_idx].progress);
    },
    [types.INTRO_OUTCOME](state, outcome) {
        state.logs[outcome.idx].progress.push([outcome.id, -1]);
        console.log("in mutation ===: " + state.logs[outcome.idx].progress);
    },
    [types.STATUS_UPDATE](state, id) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == id});
        state.logs[log_idx].status = state.logs[log_idx].status ? false : true;
    }
    // [types.TIME_UPDATE](state, newTime){
    //     state.logs[log_idx].timer = newTime;
    // },

};