import { types, getRoot } from 'mobx-state-tree';
import createTextDiff from 'textdiff-create';
import Notebook from './Notebook.model';
import User from './User.model';

export default types.late(() => 
  types.model('Note', {
    id: types.identifierNumber,
    title: types.string,
    createdAt: types.Date,
    savedContent: types.maybe(types.string),
    content: types.maybe(types.string),
    updatedAt: types.maybe(types.Date),
    saving: false,
    deleted: false,
    notebookId: types.maybeNull(types.reference(Notebook)),
    authorId: types.reference(User),
  })
  .views(self => ({
    get author() {
      return self.authorId;
    },

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
    },

    get notebook() {
      return self.notebookId;
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
      console.log({content});
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
