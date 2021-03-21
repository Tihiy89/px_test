import Axios from 'axios';

const URL_API = 'https://api.github.com/';
const URL_API_PART_USER = 'user';
const URL_API_AUTH = 'https://github.com/login/oauth/authorize';
const URL_MY = 'http://localhost:8080/';
// const URL_API_AUTH = 'https://github.com/login/oauth/authorize';

// export interface userGH{
//   ghName: String,
//   ghID: String,
//   ghUrl: String
// }

export class GitHubApi{
  // пароль? наверное не пригодится
  private user_secret:String = '';
  // идентификтаор приложения гитхаб
  private app_id:String = 'c5854afba787a9e4a397';
  // идентификтаор клиентского приложения
  private client_id:String = '2db9bbe82e963db416698f664506769dfa5a1b1f';
  // токен пользователя
  // private token:String = 'Bearer aa4664bb64beb403cc8d37fb43f0c03f3eaf2386';
  private token:String = '';

  private axios = Axios.create();

  // public async test() {
  //   console.log('GitHubApi.test');

  //   // const axios = Axios.create();
  //   const head = { Authorization:this.token };
  //   const res = await this.axios.get( URL_API+URL_API_PART_USER, { headers : head } ).then( (resp) => { return resp; });

  //   console.log(res);
  //   return 0;
  // }

  public async GetUserInfo(){
    const head = {Authorization:this.token };
    const res = await this.axios.get( URL_API+URL_API_PART_USER, { headers : head } ).then( (resp) => {
      return resp.data; });

    return res;
  }

  public setToken(_token:String){
    this.token = _token;
  }

  public aut() {
    console.log('GitHubApi.aut');

    return 0;
  }

  // формируем URL для перехода для авторизации
  // что-то вида "https://github.com/login/oauth/authorize?client_id=c5854afba787a9e4a397&redirect_uri=http://localhost:8080/"
  // в идеале добавить еще параметр state, но наши цели академические
  // и делать этого мы конечно же не будем
  public getUrlForAut():String{
    return `${URL_API_AUTH}?client_id=${this.client_id}&redirect_uri=${URL_MY}`;
  }
}
