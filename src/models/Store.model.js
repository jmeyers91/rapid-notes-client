import { types } from 'mobx-state-tree';
import Axios from 'axios';
import config from '../config';
import User from './User.model';
import Note, { NoteStore } from './Note.model';

export default types
  .model('Store', {
    loadingInitial: true,
    authToken: types.maybeNull(types.string),
    user: types.maybe(User),
    notes: types.maybe(types.array(Note))
  })
  .views(self => ({
    get loggedIn() {
      return !!(self.authToken && self.user);
    },

    get axios() {
      const { authToken } = self;
      const baseURL = '/api';
      const headers = {'Content-Type': 'application/json'};
      if(authToken) headers.Authorization = authToken;
      
      return Axios.create({ baseURL, headers });
    }
  }))
  .actions(self => ({
    async afterCreate() {
      if (self.authToken && !self.user) {
        await self.fetchUser();
      }
      self.set({loadingInitial: false});
    },

    set(fields) {
      Object.assign(self, fields);
    },

    async fetchUser() {
      const response = await self.axios.get('/user');
      const user = response.data.user;
      const notes = response.data.user.notes;
      self.set({user, notes});
    },

    async fetchNotes() {
      const response = await self.axios.get('/notes');
      const notes = response.data.notes;
      this.set({notes});
    },

    async login({ username, password, remember }) {
      const response = await self.axios.post('/login', {username, password});
      const { authToken } = response.data;
      self.set({ authToken });
      if(remember) {
        localStorage.setItem(config.authTokenKey, authToken);
      }
      await self.fetchUser();
    },

    async logout() {
      localStorage.removeItem(config.authTokenKey);
      self.set({
        authToken: null,
        user: null,
        notes: null
      });
    },
  }));
