import Vue from 'vue';

export interface ghCommit extends Vue{
  author: string,
  date: Date,
}
export interface ghAuthByComm extends Vue{
  author: string,
  countComm: number,
}