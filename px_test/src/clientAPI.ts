import Axios from 'axios';

const URL_API = 'https://api.github.com/';
const URL_API_PART_USER = 'user';
const URL_API_AUTH = 'https://github.com/login/oauth/authorize';
const URL_API_AUTH2 = 'https://github.com/login/oauth/access_token';
const URL_MY = 'http://localhost:8080/';
const URL_CORS_ERR = 'https://cors-anywhere.herokuapp.com/';

export class GitHubApi{
  // пароль? наверное не пригодится
  private user_secret:String = '';
  // идентификтаор приложения гитхаб
  private app_id:String = 'c5854afba787a9e4a397';
  // идентификтаор клиентского приложения
  private client_id:String = '2db9bbe82e963db416698f664506769dfa5a1b1f';
  // токен пользователя
  // private token:String = 'bearer aa4664bb64beb403cc8d37fb43f0c03f3eaf2386';
  private token:String = '';

  private axios = Axios.create();

  // плохая авторизация через левый сервис
  // https://cors-anywhere.herokuapp.com/
  // я обязательно попробую по-другому
  public async Aut_bad():Promise<boolean> {
    const url = new URL(window.location.href);
    const tmpCode = url.searchParams.get('code');

    const par = {
      client_id: this.app_id,
      client_secret: this.client_id,
      code: tmpCode,
    };

    const res = await this.axios.post( URL_CORS_ERR+URL_API_AUTH2, par).then( (resp) => { return resp; });

    if( res.data !== undefined ){
      // парсить не хочется, сделаем URL И разберем стандартными ф-ми
      const urlResp = new URL(URL_API_AUTH2+'?'+res.data);
      this.token = (urlResp.searchParams.get('token_type')??'') + ' ' + (urlResp.searchParams.get('access_token')??'');
      this.token = this.token.trim();
    }

    return this.token !== '';
  }

  // получаем информацию об авторизованном пользователе, пока нам нужно только имя
  public async GetUserInfo(){
    const head = {Authorization:this.token };

    const res = await this.axios.get( URL_API+URL_API_PART_USER, { headers : head } ).then( (resp) => {
      return resp.data; });

    return res;
  }

  // токен предполагается хранить прямо в классе
  public setToken(_token:String){
    this.token = _token;
  }

  // формируем URL для перехода для авторизации
  // что-то вида "https://github.com/login/oauth/authorize?client_id=c5854afba787a9e4a397&redirect_uri=http://localhost:8080/"
  // в идеале добавить еще параметр state, но наши цели академические
  // и делать этого мы конечно же не будем
  public getUrlForAut_stage1():String{
    return `${URL_API_AUTH}?client_id=${this.app_id}&redirect_uri=${URL_MY}`;
  }

  public getUrlForAut_stage2():String{
    const url = new URL(window.location.href);
    const tmpCode = url.searchParams.get('code');

    return `${URL_CORS_ERR}${URL_API_AUTH2}?client_id=${this.app_id}&client_secret=${this.client_id}&code=${tmpCode}&redirect_uri=${URL_MY}`;
  }
}
