import { Vue } from 'vue/types/vue';

declare module 'vue/types/vue' {
  export interface Vue {
    $http_gha: any
  }
}
