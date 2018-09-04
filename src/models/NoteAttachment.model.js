import Model from '@simplej/mobx-model';
import Note from './Note.model';
import UserFile from './UserFile.model';

export default class NoteAttachment extends Model {
  static get schema() {
    return {
      id: Number,
      noteId: Number,
      fileId: Number,
      createdAt: Date,
      updatedAt: Date,
      file: UserFile,
      note: Note,
    };
  }
}

