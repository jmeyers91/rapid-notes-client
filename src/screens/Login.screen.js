import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Redirect, withRouter } from 'react-router-dom';
import config from '../config';
import Screen from '../components/Screen.component';
import Form from '../components/Form.component';
import Input from '../components/Input.component';
import BlockButton from '../components/BlockButton.component';
import { boxStyle } from '../components/Box.component';

const defaultRedirect = { pathname: '/' };

@withRouter
@inject('store')
@observer
export default class Login extends Component {
  @observable username = config.defaultUsername;
  @observable password = config.defaultPassword;

  @action.bound handleUsernameChange(event) {
    this.username = event.target.value;
  }

  @action.bound handlePasswordChange(event) {
    this.password = event.target.value;
  }

  @action.bound async handleSubmit() {
    const { username, password } = this;
    const { store } = this.props;
    const remember = config.rememberAuthToken;

    await store.login({ username, password, remember });
  }

  render() {
    const { username, password } = this;
    const { store, location } = this.props;

    if(store.loggedIn) {
      const redirect = (location.state && location.state.from) || defaultRedirect;
      return <Redirect to={redirect} />;
    }

    return (
      <Root alignItems="center" justifyContent="center">
        <LoginForm direction="column" onSubmit={this.handleSubmit}>
          <Input placeholder="Username" value={username} onChange={this.handleUsernameChange}/>
          <Input placeholder="Username" value={password} onChange={this.handlePasswordChange}/>
          <BlockButton>Login</BlockButton>
        </LoginForm>
      </Root>
    );
  }
}

const Root = Screen.extend`

`;

const LoginForm = Form.extend`
  ${boxStyle}
  width: 100%;
  max-width: 300px;

  input + input {
    margin-top: 10px;
  }

  button {
    margin-top: 15px;
  }
`;
