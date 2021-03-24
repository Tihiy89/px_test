<template>
  <div>
    isAut mainform {{isAut}}<br>
    <autForm v-if="!isAut" v-model="isAut"/>
    <filterForm v-if="isAut"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import autForm from './autForm.vue';
import filterForm from './filterForm.vue';

export default Vue.extend({
  components:{autForm,filterForm},
  data(){
    return {
      isAut: false,
    };
  },
  beforeCreate(){
    this.$http_gha.setMyURL();
  },
});
</script>
