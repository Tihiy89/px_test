import Vue from 'vue';
import App from './App.vue';
import {GitHubApi} from './components/classes/clientAPI';
import tableForm from '@/components/form/tableForm.vue';
import tablePr from '@/components/form/tablePR.vue';
import MainForm from '@/components/form/mainForm.vue';

// объект через который предлполагается взаимодействие с gitHub
Vue.prototype.$http_gha = new GitHubApi;

Vue.config.productionTip = false;

Vue.component('tableForm', tableForm);
Vue.component('tablePr', tablePr);
Vue.component('MainForm', MainForm);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
