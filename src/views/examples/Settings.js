import React from 'react';

import { ajax } from 'rxjs/ajax';
import { switchMap } from 'rxjs/operators';
import { request, getToken } from 'config';
// reactstrap components
import { Card,
  Container,
  Row,
  CardHeader,
  Table,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input, CardBody
} from "reactstrap";
import moment from 'moment';
// core components
import Header from "components/Headers/Header.js";

class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        settings: {}
    }
  }

  componentWillMount() {
    this.querySettings();
  }
  querySettings() {
    ajax({
      url: request(`settings`),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': getToken(),
      }
    }).pipe(
      switchMap(res => res.response.data),
    ).subscribe(
      manager => this.setState({managers: [...this.state.managers, manager ]}), 
      err => {console.log(err); this.setState({ settings: { username: '', firstname: '', lastname: ''} })}
    )
  }

  changeLogin(){}
  changeName(){}
  changeLastName(){}
  changeStatus(){}

  render() {
    const { settings: { username, firstname, lastname} } = this.state;
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                <h2>Настройки</h2>
                </CardHeader>
                <CardBody>
                <Form>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-username" >Логин</label>
                    <Input
                      name="input-username"
                      className="form-control-alternative"
                      value={username}
                      onChange={this.changeLogin}
                      placeholder="Введите логин"
                      type="text"
                    />
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-firstname" >Имя</label>
                    <Input
                      name="input-firstname"
                      className="form-control-alternative"
                      value={firstname}
                      onChange={this.changeName}
                      placeholder="Введите имя"
                      type="text"
                    />
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-lastname" >Фамилия</label>
                    <Input
                      name="input-lastname"
                      className="form-control-alternative"
                      value={lastname}
                      onChange={this.changeLastName}
                      placeholder="Введите фамилия"
                      type="text"
                    />
                  </FormGroup>
                </Form>
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    )
  }
}

export default Settings;
