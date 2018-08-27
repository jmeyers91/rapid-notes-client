import Model from '@simplej/mobx-model';
import User from './User.model';

export default class Notebook extends Model {
  static get schema() {
    return {
      id: Number,
      name: String,
      ownerId: Number,
      owner: User,
      createdAt: Date,
      updatedAt: Date,
    };
  }
}
