<template>
  <div>
    <table-form v-model="tBody" :headList="['Название','Автор','Создан']" :sortData="['name','auth','dayOpen']" link="link:name" :paginate="25"/>
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
  methods:{
    test(){
      // this.fillTableData();
      // console.log(this);
    },
  },
  data(){
    return {
    };
  },
});
</script>