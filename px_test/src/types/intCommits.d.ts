// commits
interface ghCommit{
  author: string,
  date: Date,
}

interface ghAuthByComm{
  author: string,
  countComm: number,
}

interface ghAuthByComm{
  author: string,
  countComm: number,
}
// pr
interface ghPullReq{
  name: string,
  dateCreate: Date,
  link: string,
  auth: string,
  dayOpen: number,
  state: 'open'|'closed',
}

// вспомогательные типы для табичной формы
interface tableRow{
  ind: number,
  cols: tableCol[],
}

interface tableCol{
  ind: number,
  val: string|number,
}