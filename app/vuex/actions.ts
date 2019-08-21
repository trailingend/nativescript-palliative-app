let Vue = require('vue');

import * as types from './mutation-types';
// import { knownFolders, Folder, File } from "tns-core-modules/file-system";

export default {
    loadLocalData({commit, state}, data) {
        console.log("=== in local load === ");
        commit(types.JSON_UPDATE, data); 
    },

    loadOnlineData({commit, state}){
        let info_url = 'https://api.palliative.vchlearn.ca/_/items/info';
        let real_url = 'https://api.palliative.vchlearn.ca/_/custom/bundle';
        fetch(info_url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log("=== Something went wrong loading online info data ===");
                }
            })
            .then(info_input => {
                const version_not_match = (info_input.data[0].version > state.data_version);
                console.log(`=== in load online data === version match found? - ${version_not_match} (${state.data_version}, ${info_input.data[0].version})`);
                if (version_not_match) {
                    fetch(real_url)
                        .then((response) => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                console.log("=== Something went wrong loading online data ===");
                            }
                        })
                        .then(real_input => {
                            commit(types.JSON_UPDATE, real_input); 
                        });
                }
            });
    },

    activateUser({commit, state}, user) {
        commit(types.USER_UPDATE, user);
    },

    deactivateUser({commit, state}) {
        commit(types.USER_LOGOUT);
    },

    deleteUser({commit, state}, user_id) {
        const idx = state.users.findIndex(elem => { return elem.id === user_id });
        commit(types.USER_DELETE, idx);
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
        commit(types.CHART_CREATE, entry);
    },

    changeClientInfo({commit, state}, entry) {
        commit(types.CHART_INFO_UPDATE, entry);
    },

    changeClientNotes({commit, state}, update_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == update_item.log_id});
        const log_item = {
            idx: log_idx,
            content: update_item.content
        };
        commit(types.CHART_NOTE_UPDATE, log_item);
    },

    changeClientHistory({commit, state}, update_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == update_item.log_id});
        const log_item = {
            idx: log_idx,
            content: update_item.content
        };
        commit(types.CHART_HISTORY_UPDATE, log_item);
    },

    deleteChart({commit, state}, log_id) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == log_id});
        commit(types.CHART_DELETE, log_idx);
    },

    saveIntroUpdate({commit, state}, update_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == update_item.log_id});
        if (log_idx === -1) {
            console.log("=== In intro log update: OH NO !!! ===");
        } else {
            update_item.content.forEach(respond => {
                const existed_q_idx = state.logs[log_idx].intro_answers.findIndex(elem => { return elem.q_id === respond.q_id; });
                
                const log_item = {
                    idx: log_idx,
                    q_idx: existed_q_idx,
                    content: {
                        q_id: respond.q_id,
                        a: respond.a,
                    }
                }
                commit(types.CHART_INTRO_UPDATE, log_item);
            });
        }
    },

    saveItemsUpdate({commit, state}, update_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == update_item.log_id});
        if (log_idx === -1) {
            console.log("=== In items log update: OH NO !!! ===");
        } else {
            const existed_p_idx = state.logs[log_idx].items_answers.findIndex(p_ans => { return p_ans.id === update_item.p_id; });
            if (existed_p_idx === -1) {
                const log_item = {
                    idx: log_idx,
                    content: {
                        id: update_item.p_id,
                        a: [{
                            q_id: update_item.q_id,
                            q_type: update_item.q_type,
                            l_id: update_item.l_id,
                            a: update_item.a,
                        }]
                    }
                }
                commit(types.CHART_ITEMS_ADD, log_item);
            } else {
                const existed_q_idx = state.logs[log_idx].items_answers[existed_p_idx].a.findIndex(q_ans => { return q_ans.q_id === update_item.q_id; });
                const log_item = {
                    idx: log_idx,
                    p_idx: existed_p_idx,
                    q_idx: existed_q_idx,
                    content: {
                        q_id: update_item.q_id,
                        q_type: update_item.q_type,
                        l_id: update_item.l_id,
                        a: update_item.a,
                    }
                }
                commit(types.CHART_ITEMS_UPDATE, log_item);
            }
        }
    },

    saveOthersUpdate({commit, state}, update_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == update_item.log_id});
        if (log_idx === -1) {
            console.log("=== In others log update: OH NO !!! ===");
        } else {
            const existed_p_idx = state.logs[log_idx].others_answers.findIndex(p_ans => { return p_ans.id === update_item.p_id; });
            if (existed_p_idx === -1) {
                const log_item = {
                    idx: log_idx,
                    content: {
                        id: update_item.p_id,
                        a: [{
                            q_id: update_item.q_id,
                            q_type: update_item.q_type,
                            a: update_item.a,
                        }]
                    }
                }
                commit(types.CHART_OTHERS_ADD, log_item);
            } else {
                const existed_q_idx = state.logs[log_idx].others_answers[existed_p_idx].a.findIndex(q_ans => { return q_ans.q_id === update_item.q_id; });
                const log_item = {
                    idx: log_idx,
                    p_idx: existed_p_idx,
                    q_idx: existed_q_idx,
                    content: {
                        q_id: update_item.q_id,
                        q_type: update_item.q_type,
                        a: update_item.a,
                    }
                }
                commit(types.CHART_OTHERS_UPDATE, log_item);
            }
        }
    },

    savePlansUpdate({commit, state}, update_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == update_item.log_id});
        if (log_idx === -1) {
            console.log("=== In others log update: OH NO !!! ===");
        } else {
            const log_item = {
                idx: log_idx,
                content: update_item.content,
            };
            commit(types.CHART_PLANS_UPDATE, log_item);
        }
    },
    saveIntroProgress({commit, state}, input_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == input_item.log_id});
        if (log_idx === -1) {
            console.log("=== In intro progress update: OH NO !!! ===");
        } else {
            const progress_item = {
                idx: log_idx,
                s_id: input_item.s_id,
            };
            commit(types.CHART_INTRO_PROGRESS, progress_item);
        }
    },

    saveProtoProgress({commit, state}, input_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == input_item.log_id});
        if (log_idx === -1) {
            console.log("=== In proto progress update: OH NO !!! ===");
        } else {
            const progress_item = {
                idx: log_idx,
                p_id: input_item.p_id,
            };
            commit(types.CHART_PROTO_PROGRESS, progress_item);
        }
    },

    saveItemsProgress({commit, state}, input_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == input_item.log_id});
        if (log_idx === -1) {
            console.log("=== In items progress update: OH NO !!! ===");
        } else {
            const progress_item = {
                idx: log_idx,
                l_id: input_item.l_id,
            };
            commit(types.CHART_ITEMS_PROGRESS, progress_item);
        }
    },

    saveOthersProgress({commit, state}, input_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == input_item.log_id});
        if (log_idx === -1) {
            console.log("=== In others progress update: OH NO !!! ===");
        } else {
            const progress_item = {
                idx: log_idx,
                in_others: input_item.in_others
            };
            commit(types.CHART_OTHERS_PROGRESS, progress_item);
        }
    },

    savePlansProgress({commit, state}, input_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == input_item.log_id});
        if (log_idx === -1) {
            console.log("=== In plans progress update: OH NO !!! ===");
        } else {
            const progress_item = {
                idx: log_idx,
                has_plan: input_item.has_plan,
            };
            commit(types.CHART_PLANS_PROGRESS, progress_item);
        }
    },

    saveSummaryProgress({commit, state}, input_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == input_item.log_id});
        if (log_idx === -1) {
            console.log("=== In summary progress update: OH NO !!! ===");
        } else {
            const progress_item = {
                idx: log_idx,
                in_sum: input_item.in_sum,
            };
            commit(types.CHART_SUM_PROGRESS, progress_item);
        }
    },

    saveCallInfo({commit, state}, input_item) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == input_item.id});
        if (log_idx === -1) {
            console.log("=== In call info update: OH NO !!! ===");
        } else {
            const item = {
                idx: log_idx,
                content: input_item,
            };
            commit(types.CHART_CALL_UPDATE, item);
        }
    },

    changeChartStatus({commit, state}, log_id) {
        const log_idx = state.logs.findIndex((elem) => {return elem.id == log_id});
        commit(types.CHART_STATUS_TRUE, log_idx);
    },

    saveActiveChart({commit, state}, id) {
        commit(types.CHART_ACTIVATE, id);
    },

    deleteActiveChart({commit, state}) {
        commit(types.CHART_DEACTIVATE);
    },

    startTimer({commit, state}, timer_obj) {
        commit(types.TIMER_ADD, timer_obj);
    },
};

