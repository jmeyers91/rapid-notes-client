import './reset.css';
import './index.css';
import 'sweetalert2/dist/sweetalert2.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as StoreProvider } from 'mobx-react';
import Store from './models/Store.model';
import Router from './Router';
import config from './config';

const store = new Store();

// Add a confirmation prompt if the user tries to leave before changes have been saved
window.addEventListener('beforeunload', event => {
  if(store.hasUnsavedChanges) {
    (event || window.event).returnValue = null;
    return 'Are you sure you want to leave before your changes have finished saving?';
  }
});

if (config.globalStore) global.store = store;

const rootEl = document.getElementById('root');
const app = (
  <StoreProvider store={store}>
    <Router/>
  </StoreProvider>
);

ReactDOM.render(app, rootEl);
