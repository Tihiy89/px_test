<template>
  <div>
    <table class="tableForm">
      <tr v-for="row in tBody" :key="row">
        <th v-for="item in row" :key="item">
          {{item}}
        </th>
      </tr>
    </table>
    <br>
    <button @click="test">
      а пока кнопка
    </button>
    <br>
    tBody {{tBody}}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'tableForm',
  model:{
    prop: 'tBody',
  },
  props: {
    headList: {type: Array, default: null},
    tBody: {type: Array, default: null},
  },
  created:()=>{
    console.log('tableForm created',this);
  },
  methods:{
    test(){
      console.log('tableForm test',this);
    },
  },
  data(){
    return {
      // value: null as any,
    };
  },
});
</script>