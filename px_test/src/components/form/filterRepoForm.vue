<template>
  <div>
    <!-- БЛОК С ФИЛЬТРАМИ -->
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
    <br>
    <button @click="test">
      Запустить анализ
    </button>
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
    <button @click="mode=3">
      {{getTitleTab(3)}}
    </button>
    <p>{{titleTab}}</p>
    <table-form v-if="mode==0" v-model="AuthActive" :headList="['Пользователь','Число Commit']"/>
    <table-form v-if="mode==1" v-model="AuthPassive" :headList="['Пользователь','Число Commit']"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {reposGitHub} from '@/components/classes/repos';
import tableForm from '@/components/form/tableForm.vue';

export default Vue.extend({
  components: { tableForm },
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
    };
  },
  computed:{
    AuthActive: function():ghAuthByComm[]{
      return this.oRepo.getAuthList('active');
    },
    AuthPassive: function():ghAuthByComm[]{
      return this.oRepo.getAuthList('passive');
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
          resTitle = 'Тут может быть ваша реклама';
          break;
        case 3:
          resTitle = 'Тут может быть ваша реклама';
          break;
        default:
          resTitle = 'Неизвестное значение';
      }
      return resTitle;
    },
    async test(){
      this.oRepo.ReposAnalysis();
    },
  },
});
</script>
