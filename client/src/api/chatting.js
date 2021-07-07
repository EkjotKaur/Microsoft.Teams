const axios = require("axios");
const { mainUrl } = require("./index");
const conversationUrl = mainUrl + "conversation";
const messageUrl = mainUrl + "message";
const teamsUrl = mainUrl + "teams";
const messageTeamsUrl = mainUrl + "messageTeams";

export const getConversation = (userId) =>
  axios({
    method: "GET",
    url: `${conversationUrl}/${userId}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getMessage = (conversationId) =>
  axios({
    method: "GET",
    url: `${messageUrl}/${conversationId}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const newMessage = (message) =>
  axios({
    method: "POST",
    url: `${messageUrl}`,
    data: message,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const createTeam = (data) =>
  axios({
    method: "POST",
    url: `${teamsUrl}/create`,
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const joinTeam = (data) =>
  axios({
    method: "POST",
    url: `${teamsUrl}/join`,
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getTeams = (userId) =>
  axios({
    method: "GET",
    url: `${teamsUrl}/${userId}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
export const getTeamById = (teamId) =>
  axios({
    method: "GET",
    url: `${teamsUrl}/teamById/${teamId}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getTeamsMessage = (teamsId) =>
  axios({
    method: "GET",
    url: `${messageTeamsUrl}/${teamsId}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const newMessageTeams = (message) =>
  axios({
    method: "POST",
    url: `${messageTeamsUrl}`,
    data: message,
    headers: {
      "Content-Type": "application/json",
    },
  });
