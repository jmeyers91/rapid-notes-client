import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {
  HashRouter,
  Route,
  withRouter,
  Switch
} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.component';
import SpinnerFill from './components/SpinnerFill.component';

// Insecure screens
import Login from './screens/Login.screen';
import Register from './screens/Register.screen';
import ForgotPassword from './screens/ForgotPassword.screen';

// Secure screens
import Notes from './screens/Notes.screen';

@withRouter
@inject('store')
@observer
class InsecureRouter extends Component {
  render() {
    const { loadingInitial, loggedIn } = this.props.store;
  
    if(loadingInitial) {
      return (<InitialLoadingSpinner/>);
    }

    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgotPassword" component={ForgotPassword} />
        <ProtectedRoute
          path="/"
          component={SecureRouter}
          loggedIn={loggedIn}
          loginPath="/login"
        />
      </Switch>
    );
  }
}

@withRouter
class SecureRouter extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={Notes} />
      </Switch>
    );
  }
}

export default () => (
  <HashRouter>
    <InsecureRouter />
  </HashRouter>
);

const InitialLoadingSpinner = SpinnerFill.extend`
  width: 100vw;
  height: 100vh;
`;
