<template>
  <div>
    <div>
      <b>Вы авторизованы как: </b> {{user.name}}
    </div>
    <div v-if="!isAut">
      <a :href="urlAut" v-if="stageAut==0">
        <button title="Перейти на GitHub для авторизации">
          Авторизация
        </button>
      </a>
      <br>
      <button @click="Aut_stage2" v-if="stageAut==1" title="Разрешить этому сайту использовать данный учетной записи на GitHub">
        Завершить регистрацию
      </button>
    </div>
    <loadingForm v-if="showErrorMSG||loading" :msg="(showErrorMSG)?msgErrorAut2:''" @close="closeMSG"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data(){
    return {
      isAut: false,
      codeAut: '' as String,
      loading: false,
      msgErrorAut2: 'Не удалось получить токен, проверьте, что работает промежуточный сервер.',
      showErrorMSG: false as Boolean,
      urlAut:'',
      user:{name: 'Не авторизованы' as string},
    };
  },
  computed:{
    //0 - начало, 1 - получили код, 2 - авторизовались
    stageAut: function():number{
      const url = new URL(window.location.href);

      if(this.isAut == true){
        return 2;
      } else
      if( (url.searchParams.get('code')??'') !== '' ){
        return 1;
      }

      return 0;
    },
  },
  async created() {
      this.isAut = await this.$http_gha.checkUserToken();
      this.getUserInfo();
      this.getUrlAutGH();

      if(this.stageAut == 1)
        this.Aut_stage2();
    },
  methods: {
    closeMSG(){
      this.showErrorMSG = false;
      this.goToMainSheet();
    },
    getUrlAutGH() {
      this.urlAut = this.$http_gha.getUrlForAut_stage1();
    },
    async getUserInfo() {
      const user = await this.$http_gha.GetUserInfo();

      if(user && user.login)
        this.user.name=user.login;
    },
    goToMainSheet(){
      const url = new URL(window.location.href);
      window.location.href = url.origin;
    },
    async Aut_stage2(){
      this.loading = true;
      this.isAut = await this.$http_gha.Aut();
      if(this.isAut){
        this.$emit('aut-complete', this.isAut);
        this.goToMainSheet();
      } else {
        this.showErrorMSG = true;
      }
      this.loading = false;
    },
  },

  watch:{
    isAut:function(){
      this.getUserInfo();
    },
  },
});
</script>
