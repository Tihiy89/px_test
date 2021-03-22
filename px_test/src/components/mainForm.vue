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
        <button>
          Магия авторизации
        </button>
      </a>
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
  methods: {
    getUrlAutGH() {
      this.urlAut = this.$http_gha.getUrlForAut();
    },
    async getUserInfo() {
      // console.log('this.getUrlAutGH()',this.getUrlAutGH());

      // console.log('getUserInfo');
      const user = await this.$http_gha.GetUserInfo();

      if(user.login)
        this.user.name=user.login;
    },
  },
  created(){
    this.getUserInfo();
    this.getUrlAutGH();
  },
});
</script>
