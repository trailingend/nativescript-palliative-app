import * as types from './mutation-types';

export default {
    [types.JSON_UPDATE](state, data){
        console.log(`=== in JSON_UPDATE === updating from ${state.data_version} to ${data.info.version}`);
        state.data_version = data.info.version;
        state.intro = data.data.intro;
        state.protocols = data.data.protocols;
        state.assessment_letters = data.data.assessment_letters;
        state.plans = data.data.plans;
    },

    [types.USER_CREATE](state, user) {
        state.users.push(user);
        // console.log("=== in mutation USER_CREATE ===");
        // console.dir(state.users);
    },
    [types.USER_ALTER](state, user) {
        const userIdx = state.users.findIndex(elem => { return elem.id === user.id });
        state.users[userIdx] = user;
        // console.log("=== in mutation USER_ALTER ===");
        // console.dir(state.users);
    },
    [types.USER_UPDATE](state, user) {
        const userIdx = state.users.findIndex(elem => { return elem.id === user.id });
        state.curr_user_id = user.id;
        state.users[userIdx].shift_start = user.shift_start;
        state.users[userIdx].shift_end = user.shift_end;
        // console.log("=== in mutation USER_UPDATE ===");
        // console.dir(state.users);
    },
    [types.USER_LOGOUT](state) {
        state.curr_user_id = -1;
    },
    [types.USER_DELETE](state, user_idx) {
        state.users.splice(user_idx, 1);
    },

    [types.LOG_CREATE](state, entry){
        state.logs.unshift(entry); 
        console.log("=== in mutation LOG_CREATE ===");
        console.dir(state.logs[0]);
    },
    [types.LOG_DELETE](state, LOG_idx) {
        state.logs.splice(LOG_idx, 1);
    },
    [types.LOG_ACTIVATE](state, LOG_id) {
        state.currLogId = LOG_id;
    },
    [types.LOG_DEACTIVATE](state) {
        state.currLogId = null;
    },
    [types.LOG_STATUS_TRUE](state, LOG_idx) {
        state.logs[LOG_idx].status = true;
        console.log("in mutation status ===: " + state.logs[LOG_idx].status);
    },
    [types.LOG_INFO_UPDATE](state, entry) {
        const LOG_idx = state.logs.findIndex((elem) => {return elem.id == entry.id});
        state.logs[LOG_idx].phone = entry.phone;
        state.logs[LOG_idx].caller = entry.caller;
        state.logs[LOG_idx].client = entry.client;
        state.logs[LOG_idx].relation = entry.relation;
        state.logs[LOG_idx].info = entry.info;
    },
    [types.LOG_NOTE_UPDATE](state, LOG_item){
        state.logs[LOG_item.idx].notes = LOG_item.content;
        // console.log("=== in mutation LOG_NOTE_UPDATE ===");
        // console.dir(state.logs[LOG_item.idx].notes);
    },
    [types.LOG_INTRO_UPDATE](state, LOG_item){
        if (LOG_item.q_idx === -1) {
            state.logs[LOG_item.idx].intro_answers.push(LOG_item.content);
        } else {
            state.logs[LOG_item.idx].intro_answers[LOG_item.q_idx].a = LOG_item.content.a;
        } 
        // console.log("=== in mutation LOG_INTRO_UPDATE ===");
        // console.dir(state.logs[LOG_item.idx].intro_answers);
    },
    [types.LOG_ITEMS_ADD](state, LOG_item) {
        state.logs[LOG_item.idx].items_answers.push(LOG_item.content);
        // console.log("=== in mutation LOG_ITEMS_ADD ===");
        // console.dir(state.logs[LOG_item.idx].items_answers);
    },
    [types.LOG_ITEMS_UPDATE](state, LOG_item) {
        if (LOG_item.q_idx === -1) {
            state.logs[LOG_item.idx].items_answers[LOG_item.p_idx].a.push(LOG_item.content);
        } else {
            state.logs[LOG_item.idx].items_answers[LOG_item.p_idx].a[LOG_item.q_idx].a = LOG_item.content.a;
        } 
        // console.log("=== in mutation LOG_ITEMS_UPDATE ===");
        // console.dir(state.logs[LOG_item.idx].items_answers);
    },
    [types.LOG_OTHERS_ADD](state, LOG_item){
        state.logs[LOG_item.idx].others_answers.push(LOG_item.content);
        // console.log("=== in mutation LOG_OTHERS_ADD ===");
        // console.dir(state.logs[LOG_item.idx].others_answers);
    },
    [types.LOG_OTHERS_UPDATE](state, LOG_item){
        if (LOG_item.q_idx === -1) {
            state.logs[LOG_item.idx].others_answers[LOG_item.p_idx].a.push(LOG_item.content);
        } else {
            state.logs[LOG_item.idx].others_answers[LOG_item.p_idx].a[LOG_item.q_idx].a = LOG_item.content.a;
        } 
        // console.log("=== in mutation LOG_OTHERS_UPDATE ===");
        // console.dir(state.logs[LOG_item.idx].others_answers);
    },
    [types.LOG_RECOMMENDATIONS_UPDATE](state, LOG_item) {
        state.logs[LOG_item.idx].recommendations = LOG_item.content;
        console.log("=== in mutation LOG_RECOMMENDATIONS_UPDATE ===");
        console.dir(state.logs[LOG_item.idx].recommendations);
    },
    [types.LOG_PLANS_UPDATE](state, LOG_item) {
        state.logs[LOG_item.idx].plans_answers = LOG_item.content;
        // console.log("=== in mutation LOG_PLANS_UPDATE ===");
        // console.dir(state.logs[LOG_item.idx].plans_answers);
    },
    
    [types.LOG_INTRO_PROGRESS](state, item) {
        state.logs[item.idx].progress[0] = item.s_id;
        console.log("=== in mutation LOG_INTRO_PROGRESS === " + state.logs[item.idx].progress);
    },
    [types.LOG_PROTO_PROGRESS](state, item) {
        state.logs[item.idx].progress[1] = item.p_id;
        state.logs[item.idx].progress[2] = item.p_id > -1 ? 1 : 0;
        state.logs[item.idx].progress[3] = 0;
        state.logs[item.idx].progress[4] = 0;
        state.logs[item.idx].progress[5] = 0;
        state.logs[item.idx].progress[6] = 0;
        console.log("=== in mutation LOG_PROTO_PROGRESS === " + state.logs[item.idx].progress);
    },
    [types.LOG_ITEMS_PROGRESS](state, item) {
        state.logs[item.idx].progress[2] = item.l_id;
        console.log("=== in mutation LOG_ITEMS_PROGRESS === " + state.logs[item.idx].progress);
    },
    [types.LOG_OTHERS_PROGRESS](state, item) {
        state.logs[item.idx].progress[3] = item.in_others;
        console.log("=== in mutation LOG_OTHERS_PROGRESS === " + state.logs[item.idx].progress);
    },
    [types.LOG_RECOMMENDATIONS_PROGRESS](state, item) {
        state.logs[item.idx].progress[4] = item.in_recommendations;
        console.log("=== in mutation LOG_RECOMMENDATIONS_PROGRESS === " + state.logs[item.idx].progress);
    },
    [types.LOG_PLANS_PROGRESS](state, item) {
        state.logs[item.idx].progress[5] = item.has_plan;
        console.log("=== in mutation LOG_PLANS_PROGRESS === " + state.logs[item.idx].progress);
    },
    [types.LOG_SUM_PROGRESS](state, item) {
        state.logs[item.idx].progress[6] = item.in_sum;
        console.log("=== in mutation LOG_SUM_PROGRESS === " + state.logs[item.idx].progress);
    },
    [types.LOG_CALL_UPDATE](state, item) {
        state.logs[item.idx].nurseID = item.content.nurse_id;
        state.logs[item.idx].nurseFullname = item.content.nurse_fullname;
        state.logs[item.idx].startTime = item.content.call_start;
        state.logs[item.idx].endTime = item.content.call_end;
        // console.log("=== in mutation LOG_CALL_UPDATE === " + state.logs[item.idx]);
    },
    [types.LOG_HISTORY_UPDATE](state, LOG_item){
        state.logs[LOG_item.idx].editHistory.push(LOG_item.content);
        // console.log("=== in mutation LOG_HISTORY_UPDATE ===");
        // console.dir(state.logs[LOG_item.idx].history);
    },

    [types.TIMER_ADD](state, timer_obj){
        state.timer = timer_obj;
        console.log("=== in mutation TIMER_ADD ===");
    },
};