/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col
} from "reactstrap";
import { ajax } from 'rxjs/ajax';
import { request, getToken, saveToken } from 'config';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      remember: false,
      error: false,
    }
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeRemember = this.changeRemember.bind(this);
    this.goHome = this.goHome.bind(this);
  }
  changeUsername(e) {
    this.setState({ username: e.target.value, error: false });
  }
  changePassword(e) {
    this.setState({ password: e.target.value, error: false });
  }
  changeRemember() {
    this.setState({ remember: !this.state.remember, error: false });
  }
  goHome(e) {
    e.preventDefault();
    const { history } = this.props;
    const { username, password } = this.state;
    ajax({
      url: request(`login/token`),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': getToken(),
      },
      body: { login: username, password }
    })
    .subscribe(
      res => {
        if(res.response.success) {
          if(res.response.data.token){
            saveToken(res.response.data.token)
            history.push("/")
          }
        } else {
          this.setState({ error: true });
        }
      },
      () => this.setState({ error: true })
    ) 
    if(username === 'admin' && password === 'admin'){
      history.push("/");
    } else {
      this.setState({ error: true });
    }
  }
  renderError() {
    const { error } = this.state;
    if(error) {
      return (
        <span className="text-danger mr-2">
          <i className="ni ni-notification-70" /> Не верный логин или пароль!
        </span>
        
      );
    }
    return null;
  }
  render() {
    const { username, password, remember } = this.state; 
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <div>Авторизация</div>
                {this.renderError()}
              </div>
              <Form role="form" onSubmit={this.goHome}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Логин" value={username} onChange={this.changeUsername} type="email" autoComplete="new-email"/>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Пароль" value={password} onChange={this.changePassword} type="password" autoComplete="new-password"/>
                  </InputGroup>
                </FormGroup>
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id=" customCheckLogin"
                    type="checkbox"
                    onChange={this.changeRemember}
                    checked={remember}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheckLogin"
                  >
                    <span className="text-muted">Запомнить меня</span>
                  </label>
                </div>
                <div className="text-center">
                  <Button onClick={this.goHome} className="my-4" color="primary" type="submit">
                    Войти
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          {/* <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                <small>Forgot password?</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                <small>Create new account</small>
              </a>
            </Col>
          </Row> */}
        </Col>
      </>
    );
  }
}

export default Login;
