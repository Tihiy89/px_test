<template>
  <div>
    <div>
      <h1>Тут будет чтото полезное</h1>
      <b>Вы авторизованы как: </b> {{user.name}}
    </div>
    <div>
      <button @click="getUserInfo">Получить информацию о пользователе</button>
      <br>
      <a :href="urlAut">
        <button title="Перейти на GitHub для авторизации">
          Авторизация
        </button>
      </a>
      <br>
      <!-- <a :href="urlAut_st2">
        <button title="Разрешить этому сайту использовать данный учетной записи на GitHub">
          Завершить регистрацию
        </button>
      </a> -->
      <button @click="test" title="Разрешить этому сайту использовать данный учетной записи на GitHub">
        тест
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {},
  data(){
    return {
      user:{name: 'Не авторизованы' as string},
      urlAut:'',
    };
  },
  computed:{
    urlAut_st2: function():String{
      return this.$http_gha.getUrlForAut_stage2();
    },
  },
  methods: {
    getUrlAutGH() {
      this.urlAut = this.$http_gha.getUrlForAut_stage1();
    },
    async getUserInfo() {
      // console.log('this.getUrlAutGH()',this.getUrlAutGH());

      // console.log('getUserInfo');
      const user = await this.$http_gha.GetUserInfo();

      if(user.login)
        this.user.name=user.login;
    },
    async test(){
      this.$http_gha.test();
    },
  },
  created(){
    this.getUserInfo();
    this.getUrlAutGH();
  },
});
</script>
