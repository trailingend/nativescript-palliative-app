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
                console.log("=== in load data === does version match - " + version_not_match);
                if (version_not_match) {
                    commit(types.JSON_UPDATE, data.data); 
                }
            });
    },

    saveClientInfo({commit, state}, entry) {
        commit(types.INFO_UPDATE, entry);
    },

    saveNewProgress({commit, state}, pair) {
        commit(types.PROGRESS_UPDATE, pair);
    },

    changeProgressLoc({commit, state}, isForward) {
        commit(types.PROGRESS_JUMP, isForward);
    },

    changePatient({commit, state}, id) {
        commit(types.PATIENT_JUMP, id);
    },

    updateTimer({commit, state}, t) {
        commit(types.TIME_UPDATE, t);
    },
};

