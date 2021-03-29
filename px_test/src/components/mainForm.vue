<template>
  <div>
    <h1>Пробуем API GitHub</h1>
    <autForm @aut-complete="autComplete" />
    <filterRepoForm v-if="isAut"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import autForm from './autForm.vue';
import filterRepoForm from './filterRepoForm.vue';

export default Vue.extend({
  components:{autForm,filterRepoForm},
  data(){
    return {
      isAut: false,
    };
  },
  async beforeCreate(){
    this.$http_gha.setMyURL();
  },
  async created() {
    this.isAut = await this.$http_gha.checkUserToken();
  },
  methods:{
    autComplete(isAutForm:any){
      this.isAut = isAutForm;
    },
    async CheckUserToken():Promise<boolean>{
      return await this.$http_gha.checkUserToken();
    },
  },
});
</script>
