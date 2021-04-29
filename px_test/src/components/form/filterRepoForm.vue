<template>
  <div>
    <!-- БЛОК С ФИЛЬТРАМИ -->
    linkRepo {{linkRepo}}<br>
    <b :title="helpMsg.linkRepo">Ссылка на репозитарий  </b>
    <input type="text" @input="changeRepo" v-model="linkRepo" list="listRepo" size="50">
    <datalist id="listRepo">
      <option v-for="item in listRepos" :key="item" :value="item"></option>
    </datalist>
    <br>
    branch
    <select @change="changeBranch" v-model="workBranch">
      <option v-for="item in listBranch" :key="item" :value="item">{{item}}</option>
    </select>
    <div class="inlineBlock">период анализа </div>
    <div class="inlineBlock">
       с
      <input type="date" v-model="dateStart" @change="setDateStart"></div>
    <div class="inlineBlock">
       по
      <input type="date" v-model="dateEnd" @change="setDateEnd">
    </div>
    <br>
    <button @click="AnalisRepo">
      Запустить анализ
    </button>
    <br>
    <div class="inlineBlock">
      <div class="inlineBlock">
        Количество Pull request, открытых
        <input type="text" v-model="cntPullReqOpen" disabled class="noDisable" size="5">
      </div>
      <div class="inlineBlock">
        закрытых
        <input type="text" v-model="cntPullReqClose" disabled class="noDisable" size="5">
        старых
        <input type="text" v-model="cntPullReqOld" disabled class="noDisable" size="5">
      </div>
      <div class="inlineBlock"></div>
      <div class="inlineBlock"></div>
    </div>
    <br>
    <!-- БЛОК С ДАННЫМИ, при расширеении - делим на компоненты -->
    <button @click="mode=0">
      {{getTitleTab(0)}}
    </button>
    <button @click="mode=1">
      {{getTitleTab(1)}}
    </button>
    <button @click="mode=2">
      {{getTitleTab(2)}}
    </button>
    <p>{{titleTab}}</p>
    <table-form v-if="mode==0" v-model="AuthActive" :headList="['Пользователь','Число Commit']"/>
    <table-form v-if="mode==1" v-model="AuthPassive" :headList="['Пользователь','Число Commit']"/>
    <table-pr v-if="mode==2" v-model="PullReqList" @filter-change="setFilterPR"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {reposGitHub} from '@/components/classes/repos';

export default Vue.extend({
  props: {},
  data(){
    return {
      dateStart: null as null|string,
      dateEnd: null as null|string,
      helpMsg: {linkRepo: 'Укажите сссылку на репозитарий для анализа'},
      linkRepo: 'nfriedly/node-unblocker' as string,
      // 0 - активные авторы, 1 - пассивные авторы, 2 - , 3 -
      mode : 0 as Number,
      oRepo : new reposGitHub() as reposGitHub,
      workBranch: '' as string,
      // фильтр pull request
      filterPR: {
        showOpen: true,
        showClose: true,
        showNew: true,
        showOld: true,
      } as ghPullReqFilter,
    };
  },
  computed:{
    AuthActive: function():ghAuthByComm[]{
      return this.oRepo.getAuthList('active');
    },
    AuthPassive: function():ghAuthByComm[]{
      return this.oRepo.getAuthList('passive');
    },
    cntPullReqClose: function():number{
      return this.oRepo.getPullReqCount('close');
    },
    cntPullReqOpen: function():number{
      return this.oRepo.getPullReqCount('open');
    },
    cntPullReqOld: function():number{
      return this.oRepo.getPullReqCount('old');
    },
    listRepos: function():string[]{
      const res:string[] = this.oRepo.getlistRepo();
      const i1 = this.linkRepo.lastIndexOf('/');
      const nameTarget = this.linkRepo.substring(0, ((i1 != -1)? i1 : undefined) );
      console.log('nameTarget', nameTarget);
      console.log('this.linkRepo.lastIndexOf', this.linkRepo.lastIndexOf('/'));
      for(let ind in res){
        res[ind] = nameTarget + '/' + res[ind] ;
      }
      return res;
    },
    listBranch: function():string[]{
      return this.oRepo.getlistBranch();
    },
    PullReqList: function():ghPullReq[]{
      return this.oRepo.getPullReqList(this.filterPR);
    },
    titleTab: function():string{
      return this.getTitleTab(this.mode);
    },
  },
  async created(){
    await this.changeRepo();
    await this.changeBranch();
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
    getTitleTab(_mode:Number):string{
      let resTitle = '';
      switch (_mode) {
        case 0:
          resTitle = 'Активные авторы';
          break;
        case 1:
          resTitle = 'Пассивные авторы';
          break;
        case 2:
          resTitle = 'Список pull request';
          break;
        default:
          resTitle = 'Неизвестное значение';
      }
      return resTitle;
    },
    async AnalisRepo(){
      this.oRepo.ReposAnalysis();
    },
    setDateStart(){
      if(this.dateStart)
        this.oRepo.setDefaultDateStart(this.dateStart);
    },
    setDateEnd(){
      if(this.dateEnd)
        this.oRepo.setDefaultDateEnd(this.dateEnd);
    },
    setFilterPR(filter: ghPullReqFilter){
      this.filterPR = Object.assign({},filter);
    },
  },
});
</script>
