import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';

function ProtectedRoute(props) {
  const { loggedIn, loginPath, location } = props;

  if (loggedIn) {
    return <Route {...props} />;
  } else {
    const redirect = {
      pathname: loginPath,
      state: { from: location }
    };
    return <Redirect to={redirect} />;
  }
}

export default withRouter(ProtectedRoute);
