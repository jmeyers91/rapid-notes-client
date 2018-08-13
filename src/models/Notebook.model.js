import { types } from 'mobx-state-tree';
import User from './User.model';

export default types.late(() =>
  types.model('Notebook', {
    id: types.identifierNumber,
    name: types.string,
    ownerId: types.reference(User),
    createdAt: types.Date,
    updatedAt: types.maybeNull(types.Date),
  })
);
