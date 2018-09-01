import { observable, computed, action } from 'mobx';
import Axios from 'axios';
import config from '../config';
import User from './User.model';
import Note from './Note.model';
import Notebook from './Notebook.model';

export default class Store {
  constructor() { this.afterCreate(); }

  @observable loadingInitial = true;
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
    const headers = {'Content-Type': 'application/json'};
    if(authToken) headers.Authorization = authToken;
    
    return Axios.create({ baseURL, headers });
  }

  @computed get hasUnsavedChanges() {
    const { notes } = this;
    return notes && notes.some(note => note.hasUnsavedChanges);
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
      notes: null
    });
  }

  @action.bound
  async fetchUser() {
    const response = await this.axios.get('/user');
    const user = response.data.user;
    const notebooks = response.data.user.notebooks;
    const notes = response.data.user.notes;
    this.set({
      user: new User(this, user),
      notes: Note.fromArray(this, notes),
      notebooks: Notebook.fromArray(this, notebooks),
    });
  }

  @action.bound
  async fetchNotes() {
    const response = await this.axios.get('/notes');
    const { notes } = response.data;
    this.set({
      notes: Note.fromArray(notes)
    });
  }

  @action.bound
  async createNote() {
    const response = await this.axios.post('/note');
    const note = new Note(this, response.data.note);
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

  getNotebookById(notebookId) {
    return this.notebooks.find(notebook => notebook.id === notebookId);
  }
}
