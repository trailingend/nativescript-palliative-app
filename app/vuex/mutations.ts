import * as types from './mutation-types';

export default {
    [types.JSON_UPDATE](state, data){
        state.questions = data.questions;
        state.answers = data.answers;
        state.branches = data.branches;
        state.intro_outcomes = data.intro_outcomes;
        state.protocols = data.protocols;
    },
    [types.INFO_UPDATE](state, entry){
        state.currLogIndex = state.logs.length;
        entry.id = state.currLogIndex;
        state.logs.push(entry);
    },
    [types.PROGRESS_UPDATE](state, pair){
        const log_idx = state.currLogIndex;
        state.logs[log_idx].progress.push([pair.q_id, pair.a_id]);
    },
    [types.PROGRESS_JUMP](state, isForward){
        const log_idx = state.currLogIndex;
        if (isForward) {
            state.logs[log_idx].progressLoc = state.logs[log_idx].progressLoc + 1;
        } else {
            state.logs[log_idx].progressLoc = state.logs[log_idx].progressLoc - 1;
        }
    },
    [types.PATIENT_JUMP](state, id){
        state.currLogIndex = id;
    },
    // [types.TIME_UPDATE](state, newTime){
    //     const log_idx = state.currLogIndex;
    //     state.logs[log_idx].timer = newTime;
    // },

};