import { types } from 'mobx-state-tree';
import Note from './Note.model';

export default types.late(() =>
  types.model('User', {
    id: types.identifierNumber,
    createdAt: types.Date,
    updatedAt: types.maybeNull(types.Date),
    email: types.string,
    notes: types.maybe(types.array(Note))
  })
  .views(self => ({

  }))
  .actions(self => ({

  }))
)
