let Vue = require('vue');

import * as types from './mutation-types';
// import { knownFolders, Folder, File } from "tns-core-modules/file-system";

export default {
    loadLocalData({commit, state}, data) {
        console.log("=== in local load === ");
        commit(types.JSON_UPDATE, data); 
    },

    loadOnlineData({commit, state}){
        let url = 'https://api.palliative.vchlearn.ca/_/custom/bundle';
        fetch(url)
            .then(response => response.json())
            .then(input => {
                const version_not_match = (state.data_version != input.info.version);
                console.log("=== in load online data === version match found? - " + version_not_match);
                if (version_not_match) {
                    commit(types.JSON_UPDATE, input); 
                }
            });
    },

    activateUser({commit, state}, user) {
        const idx = state.users.findIndex(elem => { return elem.id === user.id });
        commit(types.USER_UPDATE, idx);
    },

    saveUserInfo({commit, state}, user) {
        const userIdx = state.users.findIndex(elem => { return elem.id === user.id });
        if (userIdx == -1) {
            commit(types.USER_CREATE, user);
        } else {
            commit(types.USER_ALTER, user);
        }
    },

    saveClientInfo({commit, state}, entry) {
        commit(types.LOG_CREATE, entry);
    },

    changeClientInfo({commit, state}, entry) {
        commit(types.LOG_INFO_UPDATE, entry);
    },

    deleteLog({commit, state}, log_id) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == log_id});
        commit(types.LOG_DELETE, log_idx);
    },

    saveIntroProgress({commit, state}, progress_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == progress_item.log_id});
        if (log_idx === -1) {
            console.log("=== In intro log update: OH NO !!! ===");
        } else {
            const existed_q_idx = state.logs[log_idx].intro_answers.findIndex(elem => { return elem.id === progress_item.q_id; });
            const log_item = {
                idx: log_idx,
                q_idx: existed_q_idx,
                content: {
                    id: progress_item.q_id,
                    a: progress_item.a,
                }
            }
            commit(types.INTRO_LOG_UPDATE, log_item);
        }
    },

    saveItemsProgress({commit, state}, progress_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == progress_item.log_id});
        if (log_idx === -1) {
            console.log("=== In intro log update: OH NO !!! ===");
        } else {
            const existed_p_idx = state.logs[log_idx].items_answers.findIndex(elem => { return elem.id === progress_item.p_id; });
            const log_item = {
                idx: log_idx,
                p_idx: existed_p_idx,
                content: {
                    id: progress_item.p_id,
                    a: progress_item.content,
                }
            }
            commit(types.ITEMS_LOG_UPDATE, log_item);
        }
    },

    saveOthersProgress({commit, state}, progress_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == progress_item.log_id});
        if (log_idx === -1) {
            console.log("=== In others log update: OH NO !!! ===");
        } else {
            console.log(progress_item.p_id + " " + progress_item.q_id )
            const existed_p_idx = state.logs[log_idx].others_answers.findIndex(p_ans => { return p_ans.id === progress_item.p_id; });
            console.log(progress_item.p_id + " " + progress_item.q_id + " " + existed_p_idx)
            if (existed_p_idx === -1) {
                const log_item = {
                    idx: log_idx,
                    content: {
                        id: progress_item.p_id,
                        a: [{
                            q_id: progress_item.q_id,
                            q_type: progress_item.q_type,
                            a: progress_item.a,
                        }]
                    }
                }
                commit(types.OTHERS_LOG_ADD, log_item);
            } else {
                const existed_q_idx = state.logs[log_idx].others_answers[existed_p_idx].a.findIndex(q_ans => { return q_ans.q_id === progress_item.q_id; });
                const log_item = {
                    idx: log_idx,
                    p_idx: existed_p_idx,
                    q_idx: existed_q_idx,
                    content: {
                        q_id: progress_item.q_id,
                        q_type: progress_item.q_type,
                        a: progress_item.a,
                    }
                }
                console.log(existed_p_idx + " " + existed_q_idx)
                commit(types.OTHERS_LOG_UPDATE, log_item);
            }
        }
    },

    savePlansProgress({commit, state}, progress_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == progress_item.log_id});
        if (log_idx === -1) {
            console.log("=== In others log update: OH NO !!! ===");
        } else {
            const existed_p_idx = state.logs[log_idx].plans_answers.findIndex(p_ans => { return p_ans.id === progress_item.p_id; });
            const log_item = {
                idx: log_idx,
                p_idx: existed_p_idx,
                content: {
                    id: progress_item.p_id,
                    a: progress_item.a,
                }   
            };
            commit(types.PLANS_LOG_UPDATE, log_item);
        }
    },

    changeLogStatus({commit, state}, id) {
        commit(types.STATUS_UPDATE, id);
    },

    saveActiveLog({commit, state}, id) {
        commit(types.LOG_ACTIVATE, id);
    },

    deleteActiveLog({commit, state}) {
        commit(types.LOG_DEACTIVATE);
    },

    updateTimerValue({commit, state}, curr_time) {
        commit(types.TIME_UPDATE, curr_time);
    },
    turnOnTimer({commit, state}) {
        commit(types.TIMER_ON);
        commit(types.TIME_UPDATE, 0);
    },
    turnOffTimer({commit, state}) {
        commit(types.TIMER_OFF);
        commit(types.TIME_UPDATE, 60);
    },
};

