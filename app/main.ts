import Vue from 'nativescript-vue';

import App from './components/App.vue';
import store from './vuex/store';

import VueDevtools from 'nativescript-vue-devtools';
import RadListView from 'nativescript-ui-listview/vue';


if (TNS_ENV !== 'production') {
	Vue.use(VueDevtools);
}
Vue.use(RadListView);

Vue.registerElement('MaskedTextField', () => require('nativescript-masked-text-field').MaskedTextField);
Vue.registerElement("VideoPlayer", () => require("nativescript-videoplayer").Video);

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = true;// (TNS_ENV === 'production');


new Vue({
	store,
	render: h => h('frame', [h(App)])
}).$start();