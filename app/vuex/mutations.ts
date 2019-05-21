import * as types from './mutation-types';

export default {
    [types.JSON_UPDATE](state, data){
        state.protocols = data.data.protocols;
        state.questions = data.data.intro;
    },
    [types.INFO_UPDATE](state, entry){
        state.currentPatientIdx = state.patients.length;
        entry.id = state.currentPatientIdx;
        state.patients.push(entry);
    },
    [types.PROGRESS_UPDATE](state, pair){
        const patient_idx = state.currentPatientIdx;
        state.patients[patient_idx].progress.push([pair.q_id, pair.a_id]);
    },
    [types.PROGRESS_JUMP](state, isForward){
        const patient_idx = state.currentPatientIdx;
        if (isForward) {
            state.patients[patient_idx].progressLoc = state.patients[patient_idx].progressLoc + 1;
        } else {
            state.patients[patient_idx].progressLoc = state.patients[patient_idx].progressLoc - 1;
        }
    },
    [types.PATIENT_JUMP](state, id){
        state.currentPatientIdx = id;
    },
    [types.TIME_UPDATE](state, newTime){
        const patient_idx = state.currentPatientIdx;
        state.patients[patient_idx].timer = newTime;
    },

};