import Model from '@simplej/mobx-model';
import { computed } from 'mobx';
import User from './User.model';
import config from '../config';

export default class UserFile extends Model {
  static get schema() {
    return {
      id: Number,
      name: String,
      path: String,
      mimetype: String,
      ownerId: Number,
      createdAt: Date,
      updatedAt: Date,
      owner: User,
    };
  }

  @computed get isImage() {
    return this.mimetype.startsWith('image/');
  }

  @computed get url() {
    return `${config.server}/${this.path}`;
  }
}

