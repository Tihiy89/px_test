<template>
  <div>
    <div>
      Отобразить
      <label>
        открытые
        <input type="checkbox" checked v-model="showOpen">
      </label>
      <label>
        закрытые
        <input type="checkbox" checked v-model="showClose">
      </label>
      <label>
        не старше 30 дней
        <input type="checkbox" checked v-model="showNew">
      </label>
      <label>
        старше
        <input type="checkbox" checked v-model="showOld">
      </label>
    </div>
    <table-form v-model="tBody" :headList="['Название','Автор','Открыт (дней)']" :sortData="['name','auth','dayOpen']" link="link:name" :paginate="25"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'tablePr',
  model:{
    prop: 'tBody',
  },
  props: {
    tBody: {type: Array, default: null},
  },
  computed:{
    filterParam: function():ghPullReqFilter{
      return {
        showOpen: this.showOpen,
        showClose: this.showClose,
        showNew: this.showNew,
        showOld: this.showOld,
      };
    },
  },
  data(){
    return {
      showOpen: true,
      showClose: true,
      showNew: true,
      showOld: true,
    };
  },
  watch:{
    filterParam: function(){
      this.$emit('filter-change', this.filterParam);
    },
  },
});
</script>