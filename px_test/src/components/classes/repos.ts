const URL_GH = 'https://github.com/';
// const URL_API_USER = 'orgs/{org}/repos';
// const URL_API_ORG  = 'orgs/{org}/repos';

import {GitHubApi} from '@/components/classes/clientAPI';

export class reposGitHub{
  private ghApi:GitHubApi = new GitHubApi();

  // часть URL вида  {user|org}/{repo_name}
  private urlRepo: string = '';
  // полный URL, непонятно нужен ли
  private urlRepo_Full: string = '';
  // тип юзер или орг
  private typeRepo:'user'|'org'|null = null;
  // название пользователя или орг
  private name:string = '';
  // название название репозитария
  private nameRepo:string = '';

  // ветки
  private listBranch:string[] = [];
  private mainBranch:string = '';
  private workBranch:string = '';

  // участники

  // коммиты

  constructor(){
    this.urlRepo_Full = 'https://github.com/nfriedly/set-cookie-parser';
    this.urlRepo = 'nfriedly/set-cookie-parser';
    this.typeRepo = 'user';
  }

  // ф-ии для создагния урл для апи
  // информация о репозитарии
  private URL_API_USER():string{
    return `user/${this.name}/repos`;
  }
  private URL_API_ORG():string{
    return `orgs/${this.name}/repos`;
  }

  // пытаемся проверить репозитарий
  private checkRepos(){
    this.ghApi.GitHubAPI('');
  }

  // пытаемся проверить и распарсить URL
  private parseUrlGH(_url:string){
    const u = new URL(_url, URL_GH);
    this.urlRepo_Full = u.href;
    this.urlRepo = u.pathname;
    const arr = u.pathname.split('/');
    if(arr[0] && arr[0] != ''){
      this.name=arr[0];
    }
    if(arr[1] && arr[1] != ''){
      this.nameRepo=arr[1];
    }

  }

  public setUrlGH(_url:string='nfriedly/set-cookie-parser'){
    this.parseUrlGH(_url);
  }

}
