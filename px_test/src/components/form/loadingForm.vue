<template>
  <div class="loadingForm_background">
    <div class="loadingForm_body">
      <slot v-if="msg==''" >Загрузка данных</slot>
      <slot name="msg" v-if="msg!=''">
        <div>
          {{msg}}
        </div>
        <button @click="$emit('close')" style="margin-top: 20px" >закрыть</button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'loadingForm',
  props: {
    msg: { type: String, default: '' },
  },
});
</script>