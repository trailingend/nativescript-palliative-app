import * as types from './mutation-types';

export default {
    [types.JSON_UPDATE](state, data){
        state.data_version = data.info.version;

        state.intro = data.data.intro;
        state.protocols = data.data.protocols;
        state.assessment_letters = data.data.assessment_letters;
        state.plans = data.data.plans;
    },

    [types.USER_CREATE](state, user) {
        state.curr_user_idx = state.users.length;
        state.users.push(user);
        console.log("=== in mutation USER_CREATE ===");
        // console.dir(state.users);
    },
    [types.USER_UPDATE](state, user_idx) {
        state.curr_user_idx = user_idx;
    },
    [types.USER_DELETE](state, user_idx) {
        state.users.splice(user_idx, 1);
    },
    [types.USER_ALTER](state, user) {
        const userIdx = state.users.findIndex(elem => { return elem.id === user.id });
        state.curr_user_idx = userIdx;
        state.users[userIdx] = user;
        console.log("=== in mutation USER_ALTER ===");
        // console.dir(state.users);
    },

    [types.CHART_CREATE](state, entry){
        if (state.curr_user_idx != -1) {
            entry.nurse = state.users[state.curr_user_idx].id;
        }
        state.logs.unshift(entry); 
        console.log("=== in mutation CHART_CREATE ===")
    },
    [types.CHART_DELETE](state, chart_idx) {
        state.logs.splice(chart_idx, 1);
    },
    [types.CHART_ACTIVATE](state, chart_id) {
        state.currLogId = chart_id;
    },
    [types.CHART_DEACTIVATE](state) {
        state.currLogId = null;
    },
    [types.CHART_STATUS_UPDATE](state, chart_id) {
        const chart_idx = state.logs.findIndex((elem) => {return elem.id == chart_id});
        state.logs[chart_idx].status = state.logs[chart_idx].status ? false : true;
        console.log("in mutation status ===: " + state.logs[chart_idx].status);
    },

    [types.CHART_INFO_UPDATE](state, entry) {
        const chart_idx = state.logs.findIndex((elem) => {return elem.id == entry.id});
        state.logs[chart_idx].phone = entry.phone;
        state.logs[chart_idx].caller = entry.caller;
        state.logs[chart_idx].client = entry.client;
        state.logs[chart_idx].relation = entry.relation;
        state.logs[chart_idx].nurse = entry.nurse;
        state.logs[chart_idx].info = entry.info;
    },
    [types.CHART_INTRO_UPDATE](state, chart_item){
        if (chart_item.q_idx === -1) {
            state.logs[chart_item.idx].intro_answers.push(chart_item.content);
        } else {
            state.logs[chart_item.idx].intro_answers[chart_item.q_idx].a = chart_item.content.a;
        } 
        console.log("=== in mutation CHART_INTRO_UPDATE ===");
        // console.dir(state.logs[chart_item.idx].intro_answers);
    },
    [types.CHART_ITEMS_UPDATE](state, chart_item) {
        if (chart_item.p_idx === -1) {
            state.logs[chart_item.idx].items_answers.push(chart_item.content);
        } else {
            state.logs[chart_item.idx].items_answers[chart_item.p_idx].a = chart_item.content.a;
        } 
        console.log("=== in mutation CHART_ITEMS_UPDATE ===");
        // console.dir(state.logs[chart_item.idx].items_answers);
    },
    [types.CHART_OTHERS_ADD](state, chart_item){
        state.logs[chart_item.idx].others_answers.push(chart_item.content);
        console.log("=== in mutation CHART_OTHERS_ADD ===");
        // console.dir(state.logs[chart_item.idx].others_answers);
    },
    [types.CHART_OTHERS_UPDATE](state, chart_item){
        if (chart_item.q_idx === -1) {
            state.logs[chart_item.idx].others_answers[chart_item.p_idx].a.push(chart_item.content);
        } else {
            state.logs[chart_item.idx].others_answers[chart_item.p_idx].a[chart_item.q_idx].a = chart_item.content.a;
        } 
        console.log("=== in mutation CHART_OTHERS_UPDATE ===");
        // console.dir(state.logs[chart_item.idx].others_answers);
    },
    [types.CHART_PLANS_UPDATE](state, chart_item) {
        if (chart_item.p_idx === -1) {
            state.logs[chart_item.idx].plans_answers.push(chart_item.content);
        } else {
            state.logs[chart_item.idx].plans_answers[chart_item.p_idx].a = chart_item.content.a;
        } 
        console.log("=== in mutation CHART_PLANS_UPDATE ===");
        // console.dir(state.logs[chart_item.idx].plans_answers);
    },
    
    [types.CHART_INTRO_PROGRESS](state, item) {
        state.logs[item.idx].progress[0] = item.s_id;
        console.log("=== in mutation CHART_INTRO_PROGRESS === " + state.logs[item.idx].progress);
    },
    [types.CHART_PROTO_PROGRESS](state, item) {
        state.logs[item.idx].progress[1] = item.p_id;
        state.logs[item.idx].progress[2] = -1;
        state.logs[item.idx].progress[3] = -1;
        state.logs[item.idx].progress[4] = 0;
        console.log("=== in mutation CHART_PROTO_PROGRESS === " + state.logs[item.idx].progress);
    },
    [types.CHART_ITEMS_PROGRESS](state, item) {
        state.logs[item.idx].progress[2] = item.l_id;
        console.log("=== in mutation CHART_ITEMS_PROGRESS === " + state.logs[item.idx].progress);
    },
    [types.CHART_OTHERS_PROGRESS](state, item) {
        state.logs[item.idx].progress[3] = item.q_id;
        console.log("=== in mutation CHART_OTHERS_PROGRESS === " + state.logs[item.idx].progress);
    },
    [types.CHART_PLANS_PROGRESS](state, item) {
        state.logs[item.idx].progress[4] = item.has_plan;
        console.log("=== in mutation CHART_PLANS_PROGRESS === " + state.logs[item.idx].progress);
    },

};