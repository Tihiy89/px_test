<template>
  <div>
    <div v-if="paginate>0">
      <button @click="pageDown" >&lt;&lt;</button>
      <input type="number" v-model="page" min="1" :max="maxPage" size="3" @change="pageChek">
      <button @click="pageUp">&gt;&gt;</button>
    </div>
    <table class="tableForm">
      <tr v-for="row in tDataPage" :key="row.ind">
        <th v-for="item in row.Cols" :key="item.ind">
          <div v-if="!!item.link && item.link!='' ">
            <a :href="item.link" target="_blank">
              {{item.val}}
            </a>
          </div>
          <div v-else>
            {{item.val}}
          </div>
        </th>
      </tr>
    </table>
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
    // заголовки вида ["столб1", "столб2", "столб3"]
    headList: {type: Array, default: null},
    // тело, по сути двумерный массив (массив из объектов)
    tBody: {type: Array, default: null},
    // показывать №п/п
    showNum: {type: Boolean, default: true},
    // если надо переопределить порядок данных
    // массив вида ["поле1","поле2"] где поля реальные поля из объектов в tBody
    sortData: {type: Array, default: null},
    // елси нужно в колонкку добавить ссылку опция вида "поле:колонка"
    // будем искать такое поле в объектах tBody и делать ссылку в указанной оклонке (во всех елсине указано)
    link:{type: String, default: ''},
    // пагинация
    paginate:{type: Number, default: 0},
  },
  created: function(){
    this.fillTableData();
  },
  computed:{
    // вычисляем от tBody чтобы не учитывать заголовки
    maxPage: function():number{
      return ( this.paginate != 0) ? Math.ceil((this.tBody.length/this.paginate)) : 1;
    },
    // данные таблицы с учетом пагинации
    tDataPage: function():tableRow[]{
      const perPage = ( this.paginate != 0 ) ? this.paginate : this.tData.length;
      const i1 = (this.page - 1) * perPage;
      const i2 = this.page*perPage;
      let res:tableRow[] = [];
      res = res.concat(this.tHead);
      res = res.concat(this.tData.slice(i1,i2));
      return res;
    },
  },
  methods:{
    /** читаем поля по которым должны вывести данные с учетом их порядка */
    getSortData(){
      let res = Object.assign([]);
      if(!this.sortData){
        if(this.tBody[0] && typeof this.tBody[0] == 'object' ){
          for(const col in this.tBody[0]){
            res.push(col);
          }
        }
      }
      else res = this.sortData;
      return res;
    },
    /** основной метод который готовит данные для таблицы в удобном формате */
    fillTableData(){
      const sortData = this.getSortData();

      this.tHead = Object.assign([]);
      this.tData = Object.assign([]);

      // заголовки
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
        this.tHead.push(tRow);
      }

      // основные данные
      this.tBody.forEach((rowItem: any, rowIndex) => {
        const tRow = Object.assign({});
        tRow.ind = rowIndex + 1; // 0 индекс - в заголовках если есть
        tRow.Cols = Object.assign([]);

        let col = 0;
        if(this.showNum){
          const tCol = Object.assign({});
          tCol.ind = col++;
          tCol.val = rowIndex + 1;
          tRow.Cols.push(tCol);
        }

        for(const colIndex of sortData){
          const tCol = Object.assign({});
          tCol.ind = col++;
          tCol.val = rowItem[colIndex];

          tCol.link = '';
          if(this.linkField != '' && rowItem[this.linkField]
            && ( this.linkColumn == '' || (this.linkColumn != '' && this.linkColumn == colIndex )) ){
            tCol.link = rowItem[this.linkField];
          }

          tRow.Cols.push(tCol);
        }
        this.tData.push(tRow);
      });
    },
    pageChek(){
      if(this.page > this.maxPage)
        this.page = this.maxPage;

      if(this.page < 1 ){
        this.page = 1;
      }
    },
    pageDown(){
      this.page--;
    },
    pageUp(){
      this.page++;
    },
  },
  data(){
    return {
      // просто выводить массив прямо из tBody можно, но неправильно
      // то есть да отдельный объект написан сознательно
      // а теперь и заголовки вынесем, подмешаем их отдельно
      tHead: [] as tableRow[],
      tData: [] as tableRow[],
      linkColumn: (this.link.split(':')[1])?(this.link.split(':')[1]):'',
      linkField: (this.link.split(':')[0])?(this.link.split(':')[0]):'',
      page: 1,
    };
  },
  watch:{
    tBody: 'fillTableData',
    page: 'pageChek',
  },
});
</script>