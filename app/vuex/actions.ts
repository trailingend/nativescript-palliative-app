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

    saveUserInfo({commit, state}, user) {
        const userIdx = state.users.findIndex(elem => { return elem.id === user.id });
        if (userIdx == -1) {
            commit(types.USER_CREATE, user);
        } else {
            commit(types.USER_UPDATE, userIdx);
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
            const log_answers = state.logs.find((elem) => {return elem.id == progress_item.log_id}).intro_answers;
            const find_existed = log_answers.find(elem => { return elem.id === progress_item.q_id; });
            const log_item = {
                idx: log_idx,
                action: (find_existed === undefined) ? 'ADD' : 'CHANGE',
                content: {
                    id: progress_item.q_id,
                    a: progress_item.a,
                }
            }
            commit(types.INTRO_LOG_UPDATE, log_item);
        }
    },

    revertIntroProgress({commit, state}, log_id) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == log_id});
        if (log_idx === -1) {
            console.log("=== In revert log update: OH NO !!! ===");
        } else {
            commit(types.INTRO_LOG_REVERT, log_idx);
        }
    },

    saveIntroOutcome({commit, state}, out_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == out_item.log_id});
        if (log_idx === -1) {
            console.log("=== In intro outcome update: OH NO !!! ===");
        } else {
            const outcome = {
                idx: log_idx,
                id: out_item.id
            }
            commit(types.INTRO_OUTCOME_UPDATE, outcome);
        }
    },

    revertIntroOutcome({commit, state}, log_id) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == log_id});
        if (log_idx === -1) {
            console.log("=== In intro outcome revert: OH NO !!! ===");
        } else {
            commit(types.INTRO_OUTCOME_REVERT, log_idx);
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

