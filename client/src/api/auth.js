const axios = require("axios");
const { mainUrl } = require("./index");
const userUrl = mainUrl + "api/user";

export const signup = (credentials) =>
  axios({
    method: "POST",
    url: `${userUrl}/signup`,
    data: credentials,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const login = (credentials) =>
  axios({
    method: "POST",
    url: `${userUrl}/login`,
    data: credentials,
    headers: {
      "Content-Type": "application/json",
    },
  });
