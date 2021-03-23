<template>
  <div>
    <div>
      <h1>Тут будет чтото полезное</h1>
      <b>Вы авторизованы как: </b> {{user.name}}
    </div>
    <div v-if="!isAut">
      <button @click="getUserInfo">Получить информацию о пользователе</button>
      <br>
      <a :href="urlAut">
        <button title="Перейти на GitHub для авторизации">
          Авторизация
        </button>
      </a>
      <br>
      <button @click="Aut_stage2" title="Разрешить этому сайту использовать данный учетной записи на GitHub">
        Завершить регистрацию
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  model:{
    prop: 'isAut',
    event:'change',
  },
  props: {
    // isAut: Boolean,
  },
  data(){
    return {
      user:{name: 'Не авторизованы' as string},
      urlAut:'',
      isAut: false,
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
      const user = await this.$http_gha.GetUserInfo();

      if(user.login)
        this.user.name=user.login;
    },

    async Aut_stage2(){
      this.isAut = await this.$http_gha.Aut_bad();
    },
  },
  created(){
    this.getUserInfo();
    this.getUrlAutGH();
  },
  watch:{
    isAut:function(){
      this.getUserInfo();
    },
  },
});
</script>
