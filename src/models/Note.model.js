import { types, getRoot } from 'mobx-state-tree';
import createTextDiff from 'textdiff-create';
import User from './User.model';

export default types.late(() => 
  types.model('Note', {
    id: types.identifierNumber,
    title: types.string,
    createdAt: types.Date,
    savedContent: types.maybe(types.string),
    content: types.maybe(types.string),
    updatedAt: types.maybe(types.Date),
    author: types.maybe(User),
    saving: false,
    deleted: false,
  })
  .views(self => ({
    get axios() {
      const root = getRoot(self);
      if(root === self) return null;
      return root.axios;
    },

    get routes() {
      const base = `/note/${self.id}`;
      return {
        view: base,
        edit: `${base}/edit`
      };
    },

    get contentLoaded() {
      return self.content != null;
    },

    get contentPatch() {
      const { content, savedContent } = this;
      if(content === savedContent || content == null || savedContent == null) return null;
      return createTextDiff(savedContent, content);
    },

    get lowercaseTitle() {
      return self.title.toLowerCase();
    }
  }))
  .actions(self => ({
    set(props) {
      Object.assign(self, props);
    },

    async save() {
      const { axios } = self;
      if(!axios) return; // don't save detached notes

      try {
        self.set({saving: true});
        await axios.post(`/note/${self.id}`, {
          title: self.title,
          contentPatch: self.contentPatch,
        });
        self.set({savedContent: self.content});
      } finally {
        self.set({saving: false});
      }
    },

    async fetchContent() {
      const response = await self.axios.get(`/note/${self.id}/content`);
      const { content } = response.data;
      self.set({ content, savedContent: content });
    },

    updateContent(newContent) {
      self.content = newContent || '';
    },

    matchesSearch(search) {
      return self.lowercaseTitle.includes(search);
    },
  }))
);
