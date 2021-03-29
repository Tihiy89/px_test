<template>
  <div id="app">
    <MainForm/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MainForm from './components/form/mainForm.vue';

export default Vue.extend({
  name: 'App',
  components: {MainForm},
});
</script>
