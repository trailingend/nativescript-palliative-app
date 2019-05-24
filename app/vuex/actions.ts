let Vue = require('vue');

import * as types from './mutation-types';
import { knownFolders, Folder, File } from "tns-core-modules/file-system";

export default {
    loadData({commit, state}){
        let url = 'https://api.palliative.vchlearn.ca/_/custom/bundle';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const version_not_match = (state.data_version != data.data.main.version);
                console.log("=== in load data === version match found? - " + version_not_match);
                if (version_not_match) {
                    commit(types.JSON_UPDATE, data.data); 
                }
            });
    },

    saveUserInfo({commit, state}, user) {
        const userIdx = state.users.findIndex(elem => { return elem.id === user.id });
        if (userIdx == -1) {
            commit(types.NEW_USER, user);
        } else {
            commit(types.USER_UPDATE, userIdx);
        }
    },

    saveClientInfo({commit, state}, entry) {
        commit(types.NEW_LOG, entry);
    },

    saveIntroProgress({commit, state}, progress) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == progress.log_id});
        if (log_idx === -1) {
            console.log("=== In intro log update: OH NO !!! ===");
        } else {
            const log_item = {
                idx: log_idx,
                q_and_a: [progress.q_id, progress.a_id]
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
            commit(types.INTRO_OUTCOME, outcome);
        }
    },

    changeLogStatus({commit, state}, id) {
        commit(types.STATUS_UPDATE, id);
    },

    updateTimer({commit, state}, t) {
        commit(types.TIME_UPDATE, t);
    },
};

