// enum TYPE_REPO { user, org }

const URL_GH = 'https://github.com/';

const TYPE_REPO_USER = 'USER';
const TYPE_REPO_ORG =  'ORG';

import { GitHubApi } from '@/components/classes/clientAPI';

/** предполагается что этот класс описывает объет исследования (юещр или орг-я на гитхаб)
*   и содерит все необходимые механизмы для получения и подготовки информации
*/
export class reposGitHub {
  private ghApi: GitHubApi = new GitHubApi();

  /** часть URL вида  {user|org}/{repo_name} */
  private urlRepo: string = '';
  /** полный URL, непонятно нужен ли */
  private urlRepo_Full: string = '';
  /** тип юзер или орг*/
  private typeRepo: string | null = null;
  /** название пользователя или орг */
  private name: string = '';
  /** название репозитария */
  private nameRepo: string = '';
  // доупстимые даты для анализа репозитария
  private dateStart: Date|null = null;
  private dateEnd: Date|null = null;

  /** перечень репозитариев */
  private listRepo: string[] = [];

  /** ветки */
  private listBranch: string[] = [];
  private mainBranch: string = '';
  private workBranch: string = '';

  /** коммиты и статистика вокруг них*/
  private listCommits: ghCommit[] = [];
  private listAutByCom: ghAuthByComm[] = [];

  /** pullrquest */
  private listPR: ghPullReq[] = [];

  // настройки общие
  private perPage: number = 100;

  /** участники */

  /** коммиты */

  constructor() {
    this.urlRepo_Full = '';
    this.urlRepo = '';
    this.typeRepo = null;
  }

  // ----------------------------
  // ф-ии для создагния урл для апи
  // ----------------------------

  /**  */
  private URL_API_LISTCOMMITS(page: number = 1, dateStart: null|string = null, dateEnd: null|string = null): string {
    return `repos/${this.name}/${this.nameRepo}/commits`
      +`?sha=${this.workBranch}&per_page=${this.perPage}&page=${page}`
      + ( (dateStart) ? `&since=${dateStart}` : `` )
      + ( (dateEnd) ? `&until=${dateEnd}` : `` );
  }

  /** информация о выбранном репозитарии */
  private URL_API_GETREPO(): string {
    return `repos/${this.name}/${this.nameRepo}`;
  }

  // /** информация о выбранном репозитарии */
  // private URL_API_GETREPOBRANCH(): string {
  //   return `repos/${this.name}/${this.nameRepo}/${this.workBranch}`;
  // }

  /** список веток */
  private URL_API_LISTBRANCHES(page: number = 1): string {
    return `repos/${this.name}/${this.nameRepo}/branches?per_page=${this.perPage}&page=${page}`;
  }

  /** Список PR, фильтровать прямо в апи нельзя, */
  private URL_API_LISTPULLREQ(page: number = 1): string {
    return `repos/${this.name}/${this.nameRepo}/pulls?per_page=${this.perPage}`
          +`&page=${page}&base=${this.workBranch}`
          +`&state=all`;
  }

  /**информация о репозитарии*/
  private URL_API_REPO(page: number = 1): string {
    if (this.typeRepo == TYPE_REPO_USER)
      return `users/${this.name}/repos?per_page=${this.perPage}&page=${page}`;
    else
      if (this.typeRepo == TYPE_REPO_ORG)
        return `orgs/${this.name}/repos?per_page=${this.perPage}&page=${page}`;

    return '';
  }

   /** ссылка на users, чтобы получить общие сведения об исследуемом репозитарии */
   private URL_API_USERS(): string {
    return `users/${this.name}`;
  }

  // ----------------------------
  // внутренняя кухня
  // ----------------------------
  /** пытаемся проверить репозитарий */
  private async checkRepos() {
    this.typeRepo = null;

    if( this.name ){
      const res = JSON.parse( await this.ghApi.useAPI(this.URL_API_USERS()));
      if(res.type){
        if( (<string>res.type).toUpperCase() == TYPE_REPO_USER )
          this.typeRepo = TYPE_REPO_USER;
        else
          this.typeRepo = TYPE_REPO_ORG;
      }else{
        this.clearRepo();
      }

    }
  }

  /** ф-я очищает все данные которые могут предоставляться наружу*/
  private async clearRepo(){
    this.name       = '';
    this.nameRepo   = '';
    this.listRepo   = [];
    this.listBranch = [];
    this.mainBranch = '';
    this.workBranch = '';
    this.dateStart  = null;
    this.dateEnd    = null;
    this.listCommits = [];
    this.listAutByCom = [];
  }

  /** авторов сортируем по количеству коммитов, если равное по имени */
  private ghAuthByCommSort(_a:ghAuthByComm, _b:ghAuthByComm):number{
    if( _a.countComm > _b.countComm
        || (_a.countComm == _b.countComm && _a.author > _b.author) ){
      return -1;
    }
    return 1;
  }

  /** дата в виде строки форматв гггг-мм-дд */
  private getDateStr(_d:Date):string{
    const y = (_d.getFullYear()).toString();
    const m = (_d.getMonth()+1).toString();
    const d = (_d.getDay()+1).toString();

    return ('0'+y).slice(-4) + '-' + ('0'+m).slice(-2) + '-' + ('0'+d).slice(-2);
  }

  private async loadBranchInfo() {
    // зануляем итоговые массивы
    this.listPR = this.listCommits = this.listAutByCom = Object.assign( [] );

    this.loadCommitInfo();
    this.loadPRInfo();
  }

  // todo: на болььших репозитриях на формирование массивов уходит достаточно много времени,
  // наверное правильно не тащить все во временный объект а фильтровать уже на этом этапе только нужную информацию
  // замечание1
  private async loadCommitInfo(){
    let tmpCommits = Object.assign( [] );

    if( this.typeRepo && this.workBranch){
      let page: number = 1;
      while (page) {
        const res = JSON.parse(await this.ghApi.useAPI(
            this.URL_API_LISTCOMMITS(page
              , (this.dateStart!=null)?this.getDateStr(this.dateStart):null
              , (this.dateEnd!=null)?this.getDateStr(this.dateEnd):null )));
        tmpCommits = tmpCommits.concat( res );
        page = ( tmpCommits.length < page*this.perPage) ? 0 : page + 1;
      }
    }

    this.makeCommitArray(JSON.stringify(tmpCommits));
  }

  // todo аналогично замечанию1
  // но в то же время на данном этапе выгодно хранить все имеющиеся списки параллельно
  // возможно при расширении функционала лучше быдет оставить один базовый список и из него
  // сделать получать нужный список своим отдельным методом
  private async loadPRInfo(){
    let tmpPR = Object.assign( [] );

    if( this.typeRepo && this.workBranch){
      let page: number = 1;
      while (page) {
        const res = JSON.parse(await this.ghApi.useAPI(this.URL_API_LISTPULLREQ(page)));
        tmpPR = tmpPR.concat( res );
        page = ( tmpPR.length < page*this.perPage) ? 0 : page + 1;
      }
    }

    this.makePrArray(JSON.stringify(tmpPR));
  }

  /** получаем информацию о доступныъх репозитариях */
  private async loadRepoInfo() {
    if( this.typeRepo ){
      this.listRepo = Object.assign( [] );

      let page: number = 1;
      while (page) {
        const res = await this.ghApi.useAPI(this.URL_API_REPO(page));
        this.listRepo = this.listRepo.concat(JSON.parse(this.makeUserArray(res, 'name')));
        page = ( this.listRepo.length < page*this.perPage) ? 0 : page + 1;
      }

      this.listBranch = Object.assign( [] );
      // выбран существующий репозитарий
      if(this.nameRepo != '' && this.listRepo.indexOf(this.nameRepo) != -1 ){
        // когда извлечем все ветки просто занулим чтобы прервать
        let page: number = 1;
        while (page) {
          const listBranch = await this.ghApi.useAPI(this.URL_API_LISTBRANCHES(page));
          this.listBranch = this.listBranch.concat(JSON.parse(this.makeUserArray(listBranch, 'name')));
          page = ( this.listBranch.length < page*this.perPage) ? 0 : page + 1;
        }

        // ищем ветку по-умолчанию
        // Общая информация о репозитарии
        const res = JSON.parse( await this.ghApi.useAPI(this.URL_API_GETREPO()));
        if(res.default_branch)
        {
          this.mainBranch = res.default_branch;
        }

        this.dateStart = this.dateEnd = new Date();
        if(res.created_at && (<string>res.created_at).length > 10)
        {
          this.dateStart = new Date((<string>res.created_at).substr(0,10));
        }
      }
    }
  }

  /** из ответов содержащих много всего, пробуем делать "удобные" массивы
   * предполагается что объект массив, в переменной head те свойства - котоорые переносим
  */
  private makeUserArray( _o: string, head: string ):string{
    const ob = JSON.parse(_o);
    const resArray = [];

    for (const i1 of ob){
      if(i1[head]){
        resArray.push(i1[head]);
      }
    }
    return JSON.stringify(resArray);
  }

  /** подразумевается что не только парсим коммиты (хотя получается а зачем они дальше?), но пусть будут
   *  но и вычисляем по пути информацию которую можем, в нашем случае авторов
   *  то есть результат работы ф-ии - заполненные массивы
   *  this.listCommits, this.listAutByCom
   */
  private makeCommitArray( _o: string){
    const ob = JSON.parse(_o);
    const resArray: ghCommit[] = [];
    const abc: ghAuthByComm[] = [];

    for (const itemCommit of ob){
      if(itemCommit.commit && itemCommit.commit.author
          && itemCommit.commit.author.name && itemCommit.commit.author.date){
        // формируем список коммитов
        resArray.push({ date: itemCommit.commit.author.date , author: itemCommit.commit.author.name});
        // собираем статистику по авторам
        const itemAuth = abc.find(item=>{return item.author===itemCommit.commit.author.name;});

        if(itemAuth){
          itemAuth.countComm++;
        } else {
          abc.push({author:itemCommit.commit.author.name , countComm: 1});
        }
      }
    }

    abc.sort(this.ghAuthByCommSort);

    this.listCommits = Object.assign(resArray);
    this.listAutByCom = Object.assign(abc);
  }

  /** полный список PullRequest отфилтрованный по датам */
  private makePrArray( _o: string ){
    const ob = JSON.parse(_o);
    const resArray: ghPullReq[] = [];

    for (const itemPR of ob){
      if(itemPR.url && itemPR.title && itemPR.base && itemPR.base.ref
          && itemPR.user && itemPR.user.login){
        const dCreate = new Date(itemPR.created_at);
        if( this.dateStart && this.dateEnd && dCreate >= this.dateStart && dCreate <= this.dateEnd){
          const dClose = ((itemPR.closed_at!=null)? new Date(itemPR.closed_at) : new Date());
          const countDay = Math.floor(((dClose.getTime() - dCreate.getTime())/(1000*3600*24)));

          resArray.push({
            name: itemPR.title,
            dateCreate: dCreate,
            link: itemPR.html_url,
            auth: itemPR.user.login,
            dayOpen: countDay,
            state: (itemPR.state == 'closed') ? 'closed' : 'open',
          });
        }
      }
    }
    this.listPR = Object.assign(resArray);
  }

  private ObjEmpty(_o: any):boolean{
     for(const i1 in _o){
       return false;
     }
     return true;
   }

  /** пытаемся проверить и распарсить URL */
  private async parseUrlGH(_url: string) {
    const u = new URL(_url, URL_GH);
    this.urlRepo_Full = u.href;
    this.urlRepo = u.pathname;
    const arr = u.pathname.split('/');
    if (arr[1] && arr[1] != '') {
      this.name = arr[1];
    }
    if (arr[2] && arr[2] != '') {
      this.nameRepo = arr[2];
    }
  }

  // ----------------------------
  // методы для использования извне,
  // по смыслу должны только определить репозитарий, а дальше получать готовые данные
  // ----------------------------

  /** метод устанавливает ветку репозитария для дальнешейго анализа */
  public async setBranch(_br: string){
    this.workBranch = _br;
  }

  /** непосредственно анализ выбрпнной ветки репозитария */
  public ReposAnalysis(){
    this.loadBranchInfo();
  }

  /** попытка выбрать репозитарий */
  public async setUrlGH(_url: string = '') {
    // анализируем адрес
    await this.parseUrlGH(_url);
    // проверяем что пользователь или орг существует
    // опредеяем тип репозитария
    // typeRepo != null значит всё ок
    await this.checkRepos();
    // загружаем информаци
    await this.loadRepoInfo();
  }

  /** геттеры */

  /** Возвращаем список авторов
   * _sort - актив/пассив авторы
   */
  public getAuthList(_sort:'active'|'passive' = 'active', _count:number = 30):ghAuthByComm[]{
    return (_sort == 'active')? this.listAutByCom.slice(0,_count) : this.listAutByCom.slice(-_count).reverse();
  }

  /** список доступных веток для исследуемого репозитария*/
  public getDefaultBranch():string{
    return this.mainBranch;
  }

  /** дата для начала анализи ( пока это дата создания ветки )*/
  public getDefaultDateStart():string|null{
    if(this.dateStart){
      return this.getDateStr(this.dateStart);
    }
    return null;
  }

  /** дата для начала анализи ( пока это текущая дата )*/
  public getDefaultDateEnd():string|null{
    if(this.dateEnd){
      return this.getDateStr(this.dateEnd);
    }
    return null;
  }

  /** список доступных веток для исследуемого репозитария*/
  public getlistBranch():string[]{
    return (this.typeRepo !== null)? Object.assign([],this.listBranch)  : [];
  }

  /** список доступных репозитариев для исследуемого пользователя/оргии*/
  public getlistRepo():string[]{
    return (this.typeRepo !== null)? Object.assign([],this.listRepo)  : [];
  }

  public getPullReqCount(type:'open'|'close'|'old'= 'open'):number{
    const cnt = this.listPR.reduce( (cnt,item)=>{
          if( (type == 'open' && item.state == 'open')
            || (type == 'close' && item.state == 'closed')
            || (type == 'old' && item.dayOpen >= 30) )
            cnt++;
          return cnt;
        }, 0 );

    return cnt;
  }

  public getPullReqList(type:'all'|'open'|'close'|'old'= 'all'):ghPullReq[]{
    const Res = this.listPR.filter( (item)=>{
          if( (type == 'open' && item.state == 'open')
            || (type == 'close' && item.state == 'closed')
            || (type == 'old' && item.dayOpen >= 30)
            || type == 'all' )
            return true;
          return false;
        }, 0 );

    console.log('this.listPR', this.listPR);
    console.log('getPullReqList', Res);
    return Res;
  }

  /** имя обследуемой учетной записи*/
  public getTargetName():string{
    return (this.typeRepo !== null)? this.name : '';
  }

}