import Vue from 'vue';
import App from './App.vue';
import {GitHubApi} from './components/classes/clientAPI';
// import  from './components/classes';
import {ghAuthByComm} from '@/components/classes/intCommits';

// объект через который предлполагается взаимодействие с gitHub
Vue.prototype.$http_gha = new GitHubApi;

Vue.config.productionTip = false;

// const p1:ghAuthByComm[] = [];

new Vue({
  render: (h) => h(App),
}).$mount('#app');
