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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data(){
    return {
      user:{name: 'Не авторизованы' as string},
      urlAut:'',
      isAut: false,
      codeAut: '' as String,
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

    getUrlAutGH() {
      this.urlAut = this.$http_gha.getUrlForAut_stage1();
    },

    async getUserInfo() {
      const user = await this.$http_gha.GetUserInfo();

      if(user && user.login)
        this.user.name=user.login;
    },

    async Aut_stage2(){
      this.isAut = await this.$http_gha.Aut();
      this.$emit('aut-complete', this.isAut);
      const url = new URL(window.location.href);
      window.location.href = url.origin;
    },
  },

  watch:{
    isAut:function(){
      this.getUserInfo();
    },
  },
});
</script>
