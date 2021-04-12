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

// вспомогательные типы для табичной формы
interface tableRow{
  ind: number,
  cols: tableCol[],
}

interface tableCol{
  ind: number,
  val: string|number,
}