"use strict";

let init = require("./steps/init")();
let { an_authenticated_user } = require("./steps/given");
let { we_invoke_createNote, we_invoke_updateNote, we_invoke_deleteNote } = require("./steps/when");
let idToken;
let noteId;
describe(`Given an authenticated user`, () => {
  beforeAll(async () => {
    let user = await an_authenticated_user();
    idToken = user.AuthenticationResult.IdToken;
  });

  describe(`When we invoke POST /notes endpoint`, () => {
    it("Should create a new note", async () => {
      const body = {
        id: `aa-${Date.now()}`,
        title: "A test Note",
        body: "This note is created on test at: " + new Date().toLocaleString(),
      };

      let result = await we_invoke_createNote({ idToken, body });
      noteId = result.body.id;
    //   console.log({ noteId });
      expect(result.statusCode).toEqual(201);
      expect(result.body).not.toBeNull();
    });
  });

  describe(`When we invoke PUT /notes endpoint`, () => {
    it("Should create a new note", async () => {
      const body = {
        title: "A test Note",
        body:
          "This is the updated note during test at: " +
          new Date().toLocaleString(),
      };

    //   console.log({ noteId });
      let result = await we_invoke_updateNote({ idToken, body, noteId });
      expect(result.statusCode).toEqual(200);
      expect(result.body).not.toBeNull();
    });
  });

  describe(`When we invoke DELETE /notes endpoint`, () => {
    it("Should create a new note", async () => {
    //   console.log({ noteId });
      let result = await we_invoke_deleteNote({ idToken, noteId });
      expect(result.statusCode).toEqual(200);
      expect(result.body).not.toBeNull();
    });
  });
});
