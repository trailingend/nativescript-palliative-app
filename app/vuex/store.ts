import Vue from 'vue';
import Vuex from 'vuex';
import localStorage from 'nativescript-localstorage';

import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

const NSVuexPersistent = store => {
    let storageStr = localStorage.getItem('ns-vuex-persistent');

    if (storageStr) {
        store.replaceState(JSON.parse(storageStr));
    }

    store.subscribe((mutation, state) => {
        localStorage.setItem('ns-vuex-persistent', JSON.stringify(state));
    })
};

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    plugins: [NSVuexPersistent]
});
