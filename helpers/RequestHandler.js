import axios from "axios";

class RequestHandler {
  static adminToken;
  static token;
  static setAdminToken = (token) => {
    this.saveAdminTokenToLS(token);
    this.adminToken = token;
  };
  static setToken = (token) => {
    this.saveTokenToLS(token);
    this.token = token;
  };
  static base =
    process.env.NODE_ENV == "development"
      ? "http://localhost:8000/"
      : "https://ves-events-backend-b50681294424.herokuapp.com/";

  static loadTokenFromLS = () => {
    let token;
    try {
      token = localStorage.getItem("ves_jwt_token");
    } catch (e) {
      console.error(e);
    }
    return token;
  };
  static saveTokenToLS = (token) => {
    try {
      if (token) {
        localStorage.setItem("ves_jwt_token", token);
      } else {
        localStorage.removeItem("ves_jwt_token");
      }
    } catch (e) {
      console.error(e);
    }
  };

  static loadAdminTokenFromLS = () => {
    let token;
    try {
      token = sessionStorage.getItem("ves_admin_jwt");
    } catch (e) {
      console.error(e);
    }
    return token;
  };
  static saveAdminTokenToLS = (token) => {
    try {
      if (token) {
        sessionStorage.setItem("ves_admin_jwt", token);
      } else {
        sessionStorage.removeItem("ves_admin_jwt");
      }
    } catch (e) {
      console.error(e);
    }
  };

  static get = async (url) => {
    try {
      const response = await axios.get(`${RequestHandler.base}${url}`, {
        headers: {
          ...(this.adminToken || this.token
            ? {
                Authorization: `Bearer ${this.adminToken || this.token}`,
              }
            : undefined),
        },
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };
  static post = async (url, data) => {
    try {
      const response = await axios.post(`${RequestHandler.base}${url}`, data, {
        headers: {
          ...(this.adminToken || this.token
            ? {
                Authorization: `Bearer ${this.adminToken || this.token}`,
              }
            : undefined),
        },
      });
      return response.data;
    } catch (e) {
      throw e.response?.data.message || e;
    }
  };

  static put = async (url, data) => {
    try {
      const response = await axios.put(`${RequestHandler.base}${url}`, data, {
        headers: {
          ...(this.adminToken || this.token
            ? {
                Authorization: `Bearer ${this.adminToken || this.token}`,
              }
            : undefined),
        },
      });
      return response.data;
    } catch (e) {
      throw e.response?.data.message || e;
    }
  };

  static patch = async (url, data) => {
    try {
      const response = await axios.patch(`${RequestHandler.base}${url}`, data, {
        headers: {
          ...(this.adminToken || this.token
            ? {
                Authorization: `Bearer ${this.adminToken || this.token}`,
              }
            : undefined),
        },
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  static delete = async (url) => {
    try {
      const response = await axios.delete(`${RequestHandler.base}${url}`, {
        headers: {
          ...(this.adminToken || this.token
            ? {
                Authorization: `Bearer ${this.adminToken || this.token}`,
              }
            : undefined),
        },
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };
}

export default RequestHandler;
