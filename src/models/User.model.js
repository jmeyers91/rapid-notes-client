import Model from '@simplej/mobx-model';
import Note from './Note.model';

export default class User extends Model {
  static get schema() {
    return {
      id: Number,
      createdAt: Date,
      updatedAt: Date,
      email: String,
      notes: [ Note ]
    };
  }
}
