<template>
  <div>
    linkRepo {{linkRepo}}<br>
    <b :title="helpMsg.linkRepo">Ссылка на репозитарий  </b>
    <input type="text" @change="changeRepo" v-model="linkRepo" list="listRepo" size="50">
    <datalist id="listRepo">
      <option v-for="item in listRepos" :key="item" :value="item"></option>
    </datalist>
    Branch
    <select @change="changeBranch" v-model="workBranch">
      <option v-for="item in listBranch" :key="item" :value="item">{{item}}</option>
    </select>
    <!-- <input type="" @change="changeBranch" v-model="link_branch" list="listBranch" size="50">
    <datalist id="listBranch">
      <option v-for="item in listBranch" :key="item" :value="item"></option>
    </datalist> -->
    <br>
    this.workBranch {{this.workBranch}}
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
      linkRepo: 'nfriedly/node-unblocker' as string,
      workBranch: '' as string,
      oRepo : new reposGitHub() as reposGitHub,
    };
  },
  computed:{
    listRepos: function():string[]{
      const res:string[] = this.oRepo.getlistRepo();
      const nameTarget = this.linkRepo.substring(0, this.linkRepo.lastIndexOf('/'));

      for(let ind in res){
        res[ind] = nameTarget + '/' + res[ind] ;
      }
      return res;
    },
    listBranch: function():string[]{
      return this.oRepo.getlistBranch();
    },
  },
  created(){
    this.changeRepo();
  },
  methods:{
    async changeRepo(){
      await this.oRepo.setUrlGH(this.linkRepo);
      this.workBranch = this.oRepo.getDefaultBranch();
    },
    changeBranch(){
//
    },
    async test(){
      await this.oRepo.setUrlGH(this.linkRepo);
    },
  },
});
</script>
