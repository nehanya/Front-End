import CommonService from './common-service';
// import { generateQueryParams } from 'utils';

class AuthService extends CommonService {

  async login(params: { [key: string]: string | boolean }) {
    console.log('paramsparamsparamsparams',params);
    
    return await this.post('auth/login', params);
  }


  async getMe() {
    return await this.get('auth/me',)
  }
}

export const authService = new AuthService();

