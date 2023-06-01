const axios = require('axios');
const baseUrl = 'https://dig.geotab.com:443';

class DIGAPI {
  constructor({ username, password, bearerToken, refreshToken }) {
    if (bearerToken && !refreshToken) {
      throw new Error('Missing token.');
    }
    this.username = username;
    this.password = password;
    this.bearerToken = bearerToken;
    this.refreshToken = refreshToken;
  }

  setCredentials({ bearerToken, refreshToken }) {
    this.bearerToken = bearerToken;
    this.refreshToken = refreshToken;
  }

  async authenticate() {
    try {
      const { data } = await axios.post(`${baseUrl}/authentication/authenticate`, { username: this.username, password: this.password });
      const { BearerToken, RefreshToken } = data.Data;
      this.bearerToken = BearerToken.TokenString;
      this.refreshToken = RefreshToken.TokenString;

      return {
        bearerToken: this.bearerToken,
        refreshToken: this.refreshToken
      };
    }
    catch (ex) {
      throw ex;
    }
  }

  async addRecords(records) {
    return await this.request('/Records', 'post', records);
  }

  async refreshSession() {
    try {
      const { data } = await axios.post(`${baseUrl}/Authentication/refresh-token`, { bearerToken: this.bearerToken, refreshToken: this.refreshToken });
      const { BearerToken, RefreshToken } = data.Data;
      this.bearerToken = BearerToken.TokenString;
      this.refreshToken = RefreshToken.TokenString;

      return {
        bearerToken: this.bearerToken,
        refreshToken: this.refreshToken
      };
    }
    catch (ex) {
      if (ex.response && ex.response.status === 403) {
        await this.authenticate();
        return;
      }
      throw ex;
    }
  }

  async request(url, method, body) {
    try {
      if (!this.bearerToken) {
        await this.authenticate();
      }
      const options = {
        headers: {
          Authorization: `Bearer ${this.bearerToken}`
        }
      }
      const params = body ? [body, options] : [options];
      const { data } = await axios[method](baseUrl + url, ...params);
      return data;
    }
    catch (ex) {
      if (ex.response && ex.response.status === 401) {
        await this.refreshSession();
        return await this.request(url, method, body);
      }
      throw ex;
    }
  }
}

module.exports = DIGAPI;