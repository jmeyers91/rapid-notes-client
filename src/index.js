import './reset.css';
import './index.css';
import 'sweetalert2/dist/sweetalert2.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as StoreProvider } from 'mobx-react';
import config from './config';
import Store from './models/Store.model';
import Router from './Router';


const authToken = localStorage.getItem(config.authTokenKey);
const store = Store.create({ authToken });

if (process.env.NODE_ENV === 'development') global.store = store;

const rootEl = document.getElementById('root');
const app = (
  <StoreProvider store={store}>
    <Router/>
  </StoreProvider>
);

ReactDOM.render(app, rootEl);
