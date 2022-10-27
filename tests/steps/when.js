"use strict";

const _ = require("lodash");
const Promise = this.Promise || require("promise");
const agent = require("superagent-promise")(require("superagent"), Promise);

const makeHttpRequest = async (path, method, options) => {
  const root = process.env.TEST_ROOT;
  let url = options.noteId ? `${root}/${path}/${options.noteId}` : `${root}/${path}`;

  let httpRequest = agent(method, url);
  let body = _.get(options, "body");
  let idToken = _.get(options, "idToken");
  console.log(`Invoking HTTP ${method} ${url}`);

  try {
    httpRequest.set("Authorization", idToken);
    if (body) {
      httpRequest.send(body);
    }

    let response = await httpRequest;
    // console.log(response)
    return {
      statusCode: response.status,
      body: response.body,
    };
  } catch (error) {
    return {
      statusCode: error.status,
      body: null,
    };
  }
};

exports.we_invoke_createNote = async (data) => {
  let result = await makeHttpRequest("notes", "POST", data);
  return result
};

exports.we_invoke_updateNote = async (data) => {
  let result = await makeHttpRequest("notes", "PUT", data);
  return result
};

exports.we_invoke_deleteNote = async (data) => {
  let result = await makeHttpRequest("notes", "DELETE", data);
  return result
};
