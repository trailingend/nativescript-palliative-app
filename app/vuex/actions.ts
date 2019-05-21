let Vue = require('vue');

import * as types from './mutation-types';
import { knownFolders, Folder, File } from "tns-core-modules/file-system";

export default {
    loadData({dispatch}){
        let url = 'https://palliative.vchlearn.ca/_/custom/main';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let filename = 'data.json'
                var file = knownFolders.documents().getFile(filename);
                // TODO: check version thenn write to file
                console.log("=== in load data === " + file.path);
                file.writeText(JSON.stringify(data));
            });
            // HANDLE error
    },

    displayData({commit, state}) {    
        let filename = 'data.json'
        var file = knownFolders.documents().getFile(filename);
        return new Promise(function (resolve, reject) {
            try {
                file.readText().then(function (content) {
                    var data = JSON.parse(content);
                    console.log("=== in display data === " + "updating json state");
                    commit(types.JSON_UPDATE, data); 
                });
            }
            catch (err) {
                reject(err);
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

