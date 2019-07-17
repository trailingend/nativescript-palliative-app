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
        state.curr_user_idx = state.users.length;
        state.users.push(user);
        console.log("=== in mutation USER_CREATE ===");
        console.dir(state.users);
    },
    [types.USER_UPDATE](state, user_idx) {
        state.curr_user_idx = user_idx;
    },
    [types.USER_ALTER](state, user) {
        const userIdx = state.users.findIndex(elem => { return elem.id === user.id });
        state.curr_user_idx = userIdx;
        state.users[userIdx] = user;
        console.log("=== in mutation USER_ALTER ===");
        console.dir(state.users);
    },

    [types.CHART_CREATE](state, entry){
        state.logs.unshift(entry); 
    },
    [types.CHART_DELETE](state, log_idx) {
        state.logs.splice(log_idx, 1);
    },
    [types.CHART_INFO_UPDATE](state, entry) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == entry.id});
        state.logs[log_idx].phone = entry.phone;
        state.logs[log_idx].caller = entry.caller;
        state.logs[log_idx].patient = entry.patient;
        state.logs[log_idx].relation = entry.relation;
    },
    [types.CHART_ACTIVATE](state, log_id) {
        state.currLogId = log_id;
    },
    [types.CHART_DEACTIVATE](state) {
        state.currLogId = null;
    },
    [types.INTRO_CHART_UPDATE](state, log_item){
        if (log_item.q_idx === -1) {
            state.logs[log_item.idx].intro_answers.push(log_item.content);
        } else {
            state.logs[log_item.idx].intro_answers[log_item.q_idx].a = log_item.content.a;
        } 
        console.log("=== in mutation INTRO_CHART_UPDATE ===");
        console.dir(state.logs[log_item.idx].intro_answers);
    },
    [types.ITEMS_CHART_UPDATE](state, log_item) {
        if (log_item.p_idx === -1) {
            state.logs[log_item.idx].items_answers.push(log_item.content);
        } else {
            state.logs[log_item.idx].items_answers[log_item.p_idx].a = log_item.content.a;
        } 
        console.log("=== in mutation ITEMS_CHART_UPDATE ===");
        console.dir(state.logs[log_item.idx].items_answers);
    },
    [types.OTHERS_CHART_ADD](state, log_item){
        state.logs[log_item.idx].others_answers.push(log_item.content);
        console.log("=== in mutation OTHERS_CHART_ADD ===");
        console.dir(state.logs[log_item.idx].others_answers);
    },
    [types.OTHERS_CHART_UPDATE](state, log_item){
        if (log_item.q_idx === -1) {
            state.logs[log_item.idx].others_answers[log_item.p_idx].a.push(log_item.content);
        } else {
            state.logs[log_item.idx].others_answers[log_item.p_idx].a[log_item.q_idx].a = log_item.content.a;
        } 
        console.log("=== in mutation OTHERS_CHART_UPDATE ===");
        console.dir(state.logs[log_item.idx].others_answers);
    },
    [types.PLANS_CHART_UPDATE](state, log_item) {
        if (log_item.p_idx === -1) {
            state.logs[log_item.idx].plans_answers.push(log_item.content);
        } else {
            state.logs[log_item.idx].plans_answers[log_item.p_idx].a = log_item.content.a;
        } 
        console.log("=== in mutation PLANS_CHART_UPDATE ===");
        console.dir(state.logs[log_item.idx].plans_answers);
    },
    [types.STATUS_UPDATE](state, log_id) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == log_id});
        state.logs[log_idx].status = state.logs[log_idx].status ? false : true;
        console.log("in mutation status ===: " + state.logs[log_idx].status);
    },

};