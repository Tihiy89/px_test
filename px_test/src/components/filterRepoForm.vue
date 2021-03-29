<template>
  <div>
    link_repo {{link_repo}}<br>
    <b :title="helpMsg.linkRepo">Ссылка на репозитарий  </b>
    <input type="text" @change="changeRepo" v-model="link_repo">
    <button @click="test">
      test
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {},
  data(){
    return {
      helpMsg: {linkRepo: 'Укажите сссылку на репозитарий для анализа'},
      link_repo: 'nfriedly/set-cookie-parser',
      oRepo : {
        linkFull: 'nfriedly/set-cookie-parser',
        listRepo: [] as String[],
      },
    };
  },
  methods:{
    changeRepo(){
      return 0;
    },
    test(){
      // this.default_repo += '12';
    },
  },
  watch:{
    link_repo: function(){
      // link_repo
    },
  },
});
</script>
