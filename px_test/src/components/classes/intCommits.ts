export interface ghCommit{
  author: string,
  date: Date,
}
export interface ghAuthByComm{
  author: string,
  countComm: number,
}

/** авторов сортируем по количеству коммитов, если равное по имени */
export function ghAuthByCommSort(_a:ghAuthByComm, _b:ghAuthByComm):number{
  if( _a.countComm > _b.countComm
      || (_a.countComm == _b.countComm && _a.author > _b.author) ){
    return 1;
  }
  return -1;
}

// export interface ghListCommit {
//   [i1:number]:ghCommit
//   // commits: ghCommit[],
//   /**
//    * push
//    */
//   public push() {
//   }
// }