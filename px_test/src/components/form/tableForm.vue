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
    showNum: {type: Boolean, default: true},
  },
  created: function(){
    this.fillTableData();
  },
  methods:{
    fillTableData(){
      this.tData = Object.assign([]);

      if(this.headList){
        const tRow = Object.assign({});
        tRow.ind = 0;
        tRow.Cols = Object.assign([]);
        let col = 0;
        if(this.showNum){
          const tCol = Object.assign({});
          tCol.ind = col++;
          tCol.val = '№';
          tRow.Cols.push(tCol);
        }

        this.headList.forEach((headItem: any) => {
          const tCol = Object.assign({});
          tCol.ind = col++;
          tCol.val = headItem;
          tRow.Cols.push(tCol);
        });
        this.tData.push(tRow);
      }

      const countRow = this.tData.length;

      this.tBody.forEach((rowItem: any, rowIndex) => {
        const tRow = Object.assign({});
        tRow.ind = rowIndex + countRow;
        tRow.Cols = Object.assign([]);

        let col = 0;
        if(this.showNum){
          const tCol = Object.assign({});
          tCol.ind = col++;
          tCol.val = rowIndex + 1;
          tRow.Cols.push(tCol);
        }

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
      // this.fillTableData();
      // console.log(this);
    },
  },
  data(){
    return {
      // просто выводить массив прямо из tBody можно, но неправильно
      // то есть да отдельный объект написан сознательно
      tData: [] as tableRow[],
      // tHead: [] as tableRow[],
    };
  },
  watch:{
    tBody: 'fillTableData',
  },
});
</script>