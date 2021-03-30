// enum TYPE_REPO { user, org }

const URL_GH = 'https://github.com/';

const TYPE_REPO_USER = 'USER';
const TYPE_REPO_ORG =  'ORG';

import { GitHubApi } from '@/components/classes/clientAPI';

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

  /** перечень репозитариев */
  private listRepo: string[] = [];

  /** ветки */
  private listBranch: string[] = [];
  private mainBranch: string = '';
  private workBranch: string = '';

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

  /** ссылка на users, чтобы получить общие сведения об исследуемом репозитарии */
  private URL_API_USERS(): string {
      return `users/${this.name}`;
  }

  /**информация о репозитарии*/
  private URL_API_REPO(): string {
    if (this.typeRepo == TYPE_REPO_USER)
      return `users/${this.name}/repos`;
    else
      if (this.typeRepo == TYPE_REPO_ORG)
        return `orgs/${this.name}/repos`;

    return '';
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
      }
    }
  }

  /** получаем информацию о доступныъх репозитариях */
  private async loadRepoInfo() {

    if( this.typeRepo ){
      const res = await this.ghApi.useAPI(this.URL_API_REPO());

      this.listRepo = Object.assign( [], JSON.parse(this.makeUserArray(res, 'name')));
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
    await this.checkRepos();

    this.loadRepoInfo();
  }

  // ----------------------------
  // методы для использования извне,
  // по смыслу должны только определить репозитарий, а дальше получать готовые данные
  // ----------------------------
  public setUrlGH(_url: string = 'nfriedly/set-cookie-parser') {
    this.parseUrlGH(_url);
  }

}
