<template>
  <div>
    linkRepo {{linkRepo}}<br>
    <b :title="helpMsg.linkRepo">Ссылка на репозитарий  </b>
    <input type="text" @change="changeRepo" v-model="linkRepo" list="listRepo" size="50">
    <datalist id="listRepo">
      <option v-for="item in listRepos" :key="item" :value="item"></option>
    </datalist>
    <br>
    branch
    <select @change="changeBranch" v-model="workBranch">
      <option v-for="item in listBranch" :key="item" :value="item">{{item}}</option>
    </select>
    период анализа с
    <input type="date" v-model="dateStart">
    по
    <input type="date" v-model="dateEnd">
    <!-- <br>
    this.workBranch {{this.workBranch}}
    <br>
    dateStart {{dateStart}}
    <br>
    dateEnd {{dateEnd}} -->
    <br>
    <button @click="test">
      Запустить анализ
    </button>
    <table-form v-model="AuthActive"/>
    <!-- <br>
    {{AuthActive}} -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {reposGitHub} from '@/components/classes/repos';
import tableForm from '@/components/form/tableForm.vue';

// const p1:ghAuthByComm[] = []

export default Vue.extend({
  components: { tableForm },
  props: {},
  data(){
    return {
      helpMsg: {linkRepo: 'Укажите сссылку на репозитарий для анализа'},
      linkRepo: 'nfriedly/node-unblocker' as string,
      workBranch: '' as string,
      oRepo : new reposGitHub() as reposGitHub,
      dateStart: null as null|string,
      dateEnd: null as null|string,
      // p1: null as ghAuthByComm,
    };
  },
  computed:{
    // AuthActive: function():ghAuthByComm[]{
    //   // return {};
    // },
    AuthActive: function():any{
      return [{author: 'Autor a', countComm: 12}
        ,{author: 'Autor B', countComm: 2}
        ,{author: 'Autor F', countComm: 45}];
    },
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
  async created(){
    await this.changeRepo();
    await this.changeBranch();

    // @ts-ignore no-undef
    const p1:ghAuthByComm[] = [];
    // const p1 :Object as PropType<ghAuthByComm>;//:ghAuthByComm[] = [];
  },
  methods:{
    async changeRepo(){
      await this.oRepo.setUrlGH(this.linkRepo);
      this.workBranch = this.oRepo.getDefaultBranch();
    },
    async changeBranch(){
      await this.oRepo.setBranch(this.workBranch);
      this.dateStart = this.oRepo.getDefaultDateStart();
      this.dateEnd = this.oRepo.getDefaultDateEnd();
    },
    async test(){
      // console.log('this.dateStart',this.dateStart);
      // console.log('typeof this.dateStart', typeof this.dateStart );
      this.oRepo.ReposAnalysis();
    },
  },
});
</script>
