import { observable, computed, action, runInAction } from 'mobx';
import Axios from 'axios';
import config from '../config';
import User from './User.model';
import Note from './Note.model';
import Notebook from './Notebook.model';
import NoteAttachment from './NoteAttachment.model';

export default class Store {
  constructor() { this.afterCreate(); }

  @observable loadingInitial = true;
  @observable uploadingFiles = false;
  @observable user = null;
  @observable notes = null;
  @observable notebooks = null;
  @observable authToken = localStorage.getItem(config.authTokenKey);

  @computed get loggedIn() {
    return !!(this.authToken && this.user);
  }

  @computed get axios() {
    const { authToken } = this;
    const baseURL = '/api';
    const headers = { 'Content-Type': 'application/json' };
    const options = { baseURL, headers };

    if(authToken) {
      options.headers.Authorization = authToken;
    }

    const axiosInstance = Axios.create(options);
    if(authToken) {
      // Logout automatically if a 401 response is received
      axiosInstance.interceptors.response.use(
        response => response,
        error => {
          if(error.response && error.response.status === 401) {
            this.logout();
          }
          throw error;
        }
      );
    }
    
    return axiosInstance;
  }

  @computed get hasUnsavedChanges() {
    const { notes } = this;
    return notes && notes.some(note => note.hasUnsavedChanges);
  }

  @computed get saving() {
    const { uploadingFiles, hasUnsavedChanges } = this;
    return uploadingFiles || hasUnsavedChanges;
  }

  @action
  async afterCreate() {
    if (this.authToken && !this.user) {
      await this.fetchUser();
    }
    this.set({loadingInitial: false});
  }

  @action.bound
  set(fields) {
    Object.assign(this, fields);
  }

  @action.bound
  async login({ username, password, remember }) {
    const response = await this.axios.post('/login', {username, password});
    const { authToken } = response.data;
    this.set({ authToken });
    if(remember) {
      localStorage.setItem(config.authTokenKey, authToken);
    }
    await this.fetchUser();
  }

  @action.bound
  logout() {
    localStorage.removeItem(config.authTokenKey);
    this.set({
      authToken: null,
      user: null,
      notes: null,
      loadingInitial: false,
    });
  }

  @action.bound
  async fetchUser() {
    const response = await this.axios.get('/user');
    const user = response.data.user;
    const notebooks = response.data.user.notebooks;
    const notes = response.data.user.notes;
    this.set({
      user: new User(user, this),
      notes: Note.fromArray(notes, this),
      notebooks: Notebook.fromArray(notebooks, this),
    });
  }

  @action.bound
  async fetchNotes() {
    const response = await this.axios.get('/notes');
    const { notes } = response.data;
    this.set({
      notes: Note.fromArray(notes),
    });
  }

  @action.bound
  async createNote() {
    const response = await this.axios.post('/note');
    const note = new Note(response.data.note, this);
    this.addNote(note);
    return note;
  }

  @action.bound
  async deleteNote(note) {
    await this.axios.delete(`/note/${note.id}`);
    this.removeNote(note);
  }

  @action.bound
  removeNote(note) {
    this.notes.remove(note);
  }

  @action.bound
  addNote(note) {
    // add to the beginning of the list to maintain creation date sort order
    this.notes.unshift(note);
  }

  @action.bound
  async addNoteAttachments(note, fileObjects) {
    const { axios } = this;
    const files = await this.uploadFiles(fileObjects);
    const response = await axios.post(`/note/${note.id}/attach`, { files });
    runInAction(() => {
      note.attachments.push(...NoteAttachment.fromArray(response.data.attachments, this));
    });
  }

  async uploadFiles(fileObjects) {
    try {
      this.uploadingFiles = true;
      const { axios } = this;
      const data = fileObjects.reduce((data, file, i) => {
        data.append(`file${i}`, file);
        return data;
      }, new FormData());
      const response = await axios.post('/upload', data);
      const { files } = response.data;

      return files;
    } finally {
      this.uploadingFiles = false;
    }
  }

  getNotebookById(notebookId) {
    return this.notebooks.find(notebook => notebook.id === notebookId);
  }
}
