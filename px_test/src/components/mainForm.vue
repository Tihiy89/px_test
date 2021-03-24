<template>
  <div>
    <h1>Пробуем API GitHub</h1>
    <autForm @aut-complete="autComplete" />
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
