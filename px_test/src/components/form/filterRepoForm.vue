<template>
  <div>
    link_repo {{link_repo}}<br>
    <b :title="helpMsg.linkRepo">Ссылка на репозитарий  </b>
    <input type="text" @change="changeRepo" v-model="link_repo" list="listRepo" size="50">
    <datalist id="listRepo">
      <option v-for="item in listRepos" :key="item" :value="item"></option>
    </datalist>
    <br>
    <!-- <select>
      <option v-for="item in listRepos" :key="item">{{item}}</option>
    </select>
    <br>
    listRepos
    {{listRepos}}
    <br> -->
    <!-- <input type="text" list="listRepos"> -->
    <!-- <br> -->
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
      link_repo: 'nfriedly/set-cookie-parser' as string,
      oRepo : new reposGitHub() as reposGitHub,
    };
  },
  computed:{
    listRepos: function():string[]{
      const res:string[] = this.oRepo.getlistRepo();
      const nameTarget = this.link_repo.substring(0, this.link_repo.lastIndexOf('/'));

      for(let ind in res){
        res[ind] = nameTarget + '/' + res[ind] ;
      }
      return res;
    },
  },
  created(){
    this.changeRepo();
  },
  methods:{
    changeRepo(){
      this.oRepo.setUrlGH(this.link_repo);
    },
    async test(){
      await this.oRepo.setUrlGH(this.link_repo);

      this.listRepos = Object.assign([], this.oRepo.getlistRepo());
    },
  },
});
</script>
