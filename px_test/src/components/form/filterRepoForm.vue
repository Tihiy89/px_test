<template>
  <div>
    link_repo {{link_repo}}<br>
    <b :title="helpMsg.linkRepo">Ссылка на репозитарий  </b>
    <input type="text" @change="changeRepo" v-model="link_repo">
    <br>
    <button @click="test">
      test
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {reposGitHub} from '@/components/classes/repos';

export default Vue.extend({
  props: {},
  data(){
    return {
      helpMsg: {linkRepo: 'Укажите сссылку на репозитарий для анализа'},
      link_repo: 'nfriedly/set-cookie-parser',
      oRepo : new reposGitHub() as reposGitHub,
    };
  },
  methods:{
    changeRepo(){
      return 0;
    },
    test(){
      // debugger;
      // eslint-disable-next-line
      const repo:reposGitHub = new reposGitHub();

      // this.default_repo += '12';
    },
  },
  watch:{
    link_repo: function(){
      // link_repo
    },
  },
});
</script>
