import Vue from 'vue';

import tableForm from '@/components/form/tableForm.vue';
import tablePr from '@/components/form/tablePR.vue';
import MainForm from '@/components/form/mainForm.vue';
import loadingForm from '@/components/form/loadingForm.vue';

Vue.component('tableForm', tableForm);
Vue.component('tablePr', tablePr);
Vue.component('MainForm', MainForm);
Vue.component('loadingForm', loadingForm);

import {GitHubApi} from './components/classes/clientAPI';
Vue.prototype.$http_gha = new GitHubApi;