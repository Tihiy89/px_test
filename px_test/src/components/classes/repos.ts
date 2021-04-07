// enum TYPE_REPO { user, org }

const URL_GH = 'https://github.com/';

const TYPE_REPO_USER = 'USER';
const TYPE_REPO_ORG =  'ORG';

import { GitHubApi } from '@/components/classes/clientAPI';
import { ghCommit } from '@/components/classes/intCommits';

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

  /** коммиты */
  // private listCommits: ghListCommit = [];
  private listCommits: any = [];

  // private

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
  private URL_API_LISTCOMMITS(page: number = 1, dateStart: null|Date = null, dateEnd: null|Date = null): string {
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
  }

  private getDateStr(_d:Date):string{
    const y = (_d.getFullYear()).toString();
    const m = (_d.getMonth()+1).toString();
    const d = (_d.getDay()+1).toString();

    return ('0'+y).slice(-4) + '-' + ('0'+m).slice(-2) + '-' + ('0'+d).slice(-2);
  }

  private async loadBranchInfo() {
    if( this.typeRepo && this.workBranch){
      // const res = JSON.parse(await this.ghApi.useAPI(this.URL_API_LISTCOMMITS(1)));
      this.listCommits = Object.assign( [] );
      let page: number = 1;
      while (page) {
        const res = JSON.parse(await this.ghApi.useAPI(this.URL_API_LISTCOMMITS(page)));
        // console.log('this.URL_API_LISTCOMMITS(page)', this.URL_API_LISTCOMMITS(page));
        this.listCommits = this.listCommits.concat( res );
        page = ( this.listCommits.length < page*this.perPage) ? 0 : page + 1;
      }
    }
    console.log('this.listCommits', this.listCommits);
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

  private makeCommitArray( _o: string):string{
    const ob = JSON.parse(_o);
    const resArray: ghCommit[] = [];

    for (const i1 of ob){
      if(i1.commit && i1.commit.author){
        // {}
        resArray.push({ date: new Date , author: i1.commit.author});
      }
    }
    return JSON.stringify(resArray);
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

  public async setBranch(_br: string){
    this.workBranch = _br;
    this.loadBranchInfo();
  }

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
  /** имя обследуемой учетной записи*/
  public getTargetName():string{
    return (this.typeRepo !== null)? this.name : '';
  }

}



// export interface records{
//   head:string[],
//   values: string[][],
// }