import Vue from 'vue';
import App from './App.vue';

import './prepareComponents';
import './style/style.css';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
