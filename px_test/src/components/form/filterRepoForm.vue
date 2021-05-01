<template>
  <div>
    <loadingForm v-if="loading"/>
    <!-- БЛОК С ФИЛЬТРАМИ -->
    <b :title="helpMsg.linkRepo">Ссылка на репозитарий  </b>
    <input :class="(validRepo)?'inputValid':'inputNotValid' " type="text" @input="changeRepo" v-model="linkRepo" list="listRepo" size="50">
    <datalist id="listRepo">
      <option v-for="item in listRepo" :key="item" :value="item"></option>
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
    <button @click="mode=0" :class="(mode==0)?'inputValid':''">
      {{getTitleTab(0)}}
    </button>
    <button @click="mode=1" :class="(mode==1)?'inputValid':''">
      {{getTitleTab(1)}}
    </button>
    <button @click="mode=2" :class="(mode==2)?'inputValid':''">
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
      listRepo: [] as string[],
      // индикатор загрузки данных при запуске анализа
      loading: false as Boolean,
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
      // вспомогательные
      linkRepo_old: '' as string,
      nameTarget_old: '' as string,
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
    listBranch: function():string[]{
      return this.oRepo.getlistBranch();
    },
    nameTarget: function():string{
      const i1 = this.linkRepo.lastIndexOf('/');
      return this.linkRepo.substring(0, ((i1 != -1)? i1 : undefined) );
    },
    PullReqList: function():ghPullReq[]{
      return this.oRepo.getPullReqList(this.filterPR);
    },
    titleTab: function():string{
      return this.getTitleTab(this.mode);
    },
    validRepo: function():boolean{
      return this.oRepo.getRepoIsValid();
    },
  },
  async created(){
    this.linkRepo = await this.oRepo.getDefaultRepoLink();
    await this.changeRepo();
    await this.changeBranch();
  },
  methods:{
    async changeRepo(){
      const tmpLinkRepo = this.linkRepo;
      const updListRepo = this.nameTarget != this.nameTarget_old;

      if(updListRepo)
      {
        this.listRepo = Object.assign([]);
      }

      // выжидаем таймаут при вводе, чтобы не слать лишних запросов
      setTimeout(async() => {
        if(tmpLinkRepo == this.linkRepo){
          await this.oRepo.setUrlGH(this.linkRepo);
          this.workBranch = this.oRepo.getDefaultBranch();
          this.changeBranch();

          if(updListRepo)
          {
            this.getListRepos();
          }
        }
      }, 1000);

      this.nameTarget_old = this.nameTarget;
      this.linkRepo_old = this.linkRepo;
    },
    async changeBranch(){
      await this.oRepo.setBranch(this.workBranch);
      this.dateStart = this.oRepo.getDefaultDateStart();
      this.dateEnd = this.oRepo.getDefaultDateEnd();
    },
    async getListRepos(){
      const res:string[] = await this.oRepo.getlistRepo();
      for(let ind in res){
        res[ind] = this.nameTarget + '/' + res[ind] ;
      }
      this.listRepo = Object.assign([], res);
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
      this.loading = true;
      await this.oRepo.ReposAnalysis();
      this.loading = false;
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
