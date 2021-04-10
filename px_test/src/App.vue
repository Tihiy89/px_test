<template>
  <div id="app">
    <MainForm/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MainForm from './components/form/mainForm.vue';

// import {ghAuthByComm} from './components/classes';

export default Vue.extend({
  name: 'App',
  components: {MainForm},
});
</script>
