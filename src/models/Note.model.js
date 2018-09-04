import Model from '@simplej/mobx-model';
import { observable, computed, action } from 'mobx';
import DiffMatchPatch from 'diff-match-patch';
import User from './User.model';
import NoteAttachment from './NoteAttachment.model';

const diffMatchPatch = new DiffMatchPatch();
let saveQueue = Promise.resolve();

export default class Note extends Model {
  @observable saving = false;
  @observable deleted = false;
  @observable loadingContent = false;

  static get schema() {
    return {
      id: Number,
      title: String,
      revision: Number,
      createdAt: Date,
      savedContent: String,
      content: String,
      updatedAt: Date,
      notebookId: Number,
      authorId: Number,
      author: User,
      attachments: [ NoteAttachment ],
    };
  }

  @computed get axios() {
    return this.store.axios;
  }

  @computed get routes() {
    const base = `/note/${this.id}`;
    return {
      view: base,
      edit: `${base}/edit`
    };
  }

  @computed get contentLoaded() {
    return this.content != null;
  }

  @computed get contentPatch() {
    const { content, savedContent } = this;
    if(content === savedContent || content == null || savedContent == null) return null;
    
    return createContentPatch(savedContent, content);
  }

  @computed get lowercaseTitle() {
    return this.title.toLowerCase();
  }

  @computed get notebook() {
    return this.notebookId;
  }

  @computed get hasUnsavedChanges() {
    const { saving, savedContent, content } = this;
    return saving || savedContent !== content;
  }

  @action set(fields) {
    Object.assign(this, fields);
  }

  @action async forceSave() {
    const { axios } = this;

    try {
      this.set({
        saving: true,
        revision: this.revision + 1
      });
      await axios.post(`/note/${this.id}`, {
        title: this.title,
        contentPatch: this.contentPatch,
        revision: this.revision,
      });
      this.set({savedContent: this.content});
    } finally {
      this.set({saving: false});
    }
  }

  @action save() {
    saveQueue = saveQueue
      .then(() => this.forceSave())
      .catch(error => console.log('Failed to save', error));

    return saveQueue;
  }

  @action async fetchContent() {
    try {
      this.loadingContent = true;
      const response = await this.axios.get(`/note/${this.id}`);
      const { note } = response.data;
      this.patch(note);
      this.savedContent = this.content;
    } finally {
      this.loadingContent = false;
    }
  }

  @action setContent(newContent) {
    this.content = newContent || '';
  }

  matchesSearch(search) {
    return this.lowercaseTitle.includes(search);
  }
}

function createContentPatch(oldText, newText) {
  const diffs = diffMatchPatch.diff_main(oldText, newText);
  diffMatchPatch.diff_cleanupEfficiency(diffs);
  return diffMatchPatch.patch_make(diffs);
}
