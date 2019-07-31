import Vue from 'nativescript-vue';

import App from './components/App.vue';
import store from './vuex/store';

// import VueDevtools from 'nativescript-vue-devtools';
import RadListView from 'nativescript-ui-listview/vue';


// if (TNS_ENV !== 'production') {
// 	Vue.use(VueDevtools);
// }
Vue.use(RadListView);
// Vue.registerElement("PreviousNextView", () => require("nativescript-iqkeyboardmanager").PreviousNextView);
// Vue.registerElement("TextViewWithHint", () => require("nativescript-iqkeyboardmanager").TextViewWithHint);
Vue.registerElement('MaskedTextField', () => require('nativescript-masked-text-field').MaskedTextField);

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = true;// (TNS_ENV === 'production');


new Vue({
	store,
	render: h => h('frame', [h(App)])
}).$start();