<template>
  <div>
    <table class="tableForm">
      <tr v-for="row in tData" :key="row.ind">
        <th v-for="item in row.Cols" :key="item.ind">
          {{item.val}}
        </th>
      </tr>
    </table>
    <br>
    <!-- <button @click="test">
      а пока кнопка
    </button>
    <br>
    tData {{tData}} -->
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
    fillTableData(){
      this.tData = Object.assign([]);
      this.tBody.forEach((rowItem: any, rowIndex) => {
        const tRow = Object.assign({});
        tRow.ind = rowIndex;
        tRow.Cols = Object.assign([]);

        let col = 0;
        for(const colIndex in rowItem){
          const tCol = Object.assign({});
          tCol.ind = col++;
          tCol.val = rowItem[colIndex];
          tRow.Cols.push(tCol);
        }
        this.tData.push(tRow);
      });
    },
    test(){
      this.fillTableData();
    },
  },
  data(){
    return {
      // просто выводить массив прямо из tBody можно, но неправильно
      // то есть да отдельный объект написан сознательно
      tData: [] as tableRow[],
    };
  },
  watch:{
    tBody: 'fillTableData',
  },
});
</script>