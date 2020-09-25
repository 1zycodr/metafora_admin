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
  Input
} from "reactstrap";
import moment from 'moment';
// core components
import Header from "components/Headers/Header.js";
const managers = [
  {id:1, userID:2,	chatID:435274667, firstname:'Виталий', lastname:'Никонов', username:'N_Vitas', reghash:'1röÖr7', date:'2020-08-19 06:08:30',	status:2},
  {id:2, userID:3,	chatID:553603486, firstname:'Eugene', lastname:'Antonov', username:'', reghash:'6Å9qev', date:'2020-09-10 10:26:50',	status:2},
  {id:4, userID:4,	chatID:1233452136, firstname:'Olga', lastname:'Antonova', username:'', reghash:'SMESxÖ', date:'2020-09-10 10:31:19',	status:2},
  {id:5, userID:0,	chatID:1219646264, firstname:'Metafora', lastname:'', username:'', reghash:'ELH2cl', date:'2020-09-10 10:35:46',	status:1},
  {id:6, userID:0,	chatID:1255719428, firstname:'Анастасия',	lastname:'Тесленко', username:'', reghash:'7LpGS0', date:'2020-09-10 10:44:43',	status:1},
  {id:7, userID:0,	chatID:532031398, firstname:'Metafora', lastname:'', username:'', reghash:'B7145C', date:'2020-09-10 10:45:13',	status:1},
  {id:8, userID:0,	chatID:374090104, firstname:'Nursulu', lastname:'K', username:'', reghash:'6YWUÅv', date:'2020-09-10 10:59:34',	status:1},
  {id:9, userID:0,	chatID:800646519, firstname:'Полина', lastname:'', username:'', reghash:'pOBdÖa', date:'2020-09-10 11:03:16',	status:1},
]
const statuses = ['Заблокирован', 'Не подтвержден', 'Активный']
class Managers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        managers : [],
        modal: {
          open: false,
          title: 'Удаление менеджера',
          body: 'Вы действительно хотите удалить менеджера?',
          ok: this.toggle.bind(this),
          okTitle: 'Да',
          cancel: this.toggle.bind(this),
          cancelTitle: 'Отмена',
        },
        firstname: '',
        lastname:'',
        username:'',
        status:0,
    }
    this.deleteManager = this.deleteManager.bind(this);
    this.editManager = this.editManager.bind(this);
    this.changeLogin = this.changeLogin.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeLastName = this.changeLastName.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.queryManagers();
  }
  queryManagers() {
    ajax({
      url: request(`manager`),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': getToken(),
      }
    }).pipe(
      switchMap(res => res.response.data),
    ).subscribe(
      manager => this.setState({managers: [...this.state.managers, manager ]}), 
      err => {console.log(err); this.setState({ managers: managers })}
    )
  }

  changeLogin(e) { this.setState({ username: e.target.value })}
  changeName(e) { this.setState({ firstname: e.target.value })}
  changeLastName(e) { this.setState({ lastname: e.target.value })}
  changeStatus(e) { this.setState({ status: e.target.value })}
  deleteManager(index) { 
    const managers = this.state.managers;
    const deleteManager = () => {
      ajax({
        url: request(`manager/delete`),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': getToken(),
        },
        body: managers[index]
      })
      .subscribe(
        res => {
          if(res.response.success) {
            delete managers[index];
            this.setState({ managers, modal: {...this.state.modal, open: !this.state.modal.open} })
          }
        }
      );
    }
    this.setState({ modal: {...this.state.modal, 
      open: !this.state.modal.open,
      title: 'Удаление менеджера',
      body: `Вы действительно хотите удалить менеджера ${managers[index].username}?`,
      ok: deleteManager,
    }})
  }
  editManager(index) { 
    const manager = this.state.managers[index];
    const editManager = () => {
      const { firstname, lastname, username, status } = this.state;
      // ajax({
      //   url: request(`group/delete`),
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'authorization': getToken(),
      //   },
      //   body: {...group, view: group.view ? 1 : 0 }
      // })
      const managers = this.state.managers.map((m, k) => {
        if(k === index) {
          m.firstname = firstname;
          m.lastname = lastname;
          m.username = username;
          m.status = parseInt(status, 10);
          ajax({
            url: request(`manager/update`),
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'authorization': getToken(),
            },
            body: m
          })
          .subscribe()
        }
        return m;
      })
      this.setState({
        modal: {...this.state.modal, open: !this.state.modal.open},
        managers,
        firstname: '',
        lastname: '', 
        username: '',
        status: 0
      })
    }
    const form = () => {
      const { firstname, lastname, username, status } = this.state;
      return <Form>
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
        <FormGroup>
          <label className="form-control-label" htmlFor="input-status" >Статус</label>
          <Input
            name="input-status"
            className="form-control-alternative"
            defaultValue={status}
            onChange={this.changeStatus}
            type="select"
          >
            {statuses.map((v, k) => (<option key={k} value={k}>{v}</option>))}
          </Input>
        </FormGroup>
      </Form>
    }

    this.setState({ modal: {...this.state.modal, 
        open: !this.state.modal.open,
        title: 'Изменение менеджера',
        body: form,
        ok: editManager,
      },
      firstname: manager.firstname, 
      lastname: manager.lastname, 
      username: manager.username,
      status: manager.status,
    })
  }

  toggle() {
    this.setState({ modal: {...this.state.modal, open: !this.state.modal.open} })
  }

  render() {
    const { modal } = this.state;
    return (
      <>
        <Modal isOpen={modal.open} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{modal.title}</ModalHeader>
          <ModalBody>{typeof modal.body === 'function' ? modal.body() : modal.body }</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={modal.ok}>{modal.okTitle}</Button>{' '}
            <Button color="secondary" onClick={modal.cancel}>{modal.cancelTitle}</Button>
          </ModalFooter>
        </Modal>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                <h2>Менеджеры</h2>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                      <tr>
                          <th>Логин</th>
                          <th>Имя</th>
                          <th>Фамилия</th>
                          <th>Дата</th>
                          <th>Статус</th>
                          <th scope="col" />
                      </tr>
                  </thead>
                  <tbody>
                      {
                          this.state.managers.map(
                              (manager, index) => {
                                return <Manager username={ manager.username } name={ manager.firstname }
                                  surname={ manager.lastname } date={ manager.date }
                                  deleteManager={ this.deleteManager }
                                  editManager={ this.editManager }
                                  index={ index }
                                  status={ manager.status }
                                  key={ index }
                                />
                              }
                          )
                          
                      }
                  </tbody>
                </Table>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    )
  }
}

function Manager(props) {
  return (
      <tr>
          <td>{ props.username }</td>
          <td>{ props.name }</td>
          <td>{ props.surname }</td>
          <td>{ moment(props.date, 'YYYY-MM-DD hh:mm:ss').add(6, 'hours').format('DD.MM.YYYY HH:mm:ss') }</td>
          <td>{ statuses[props.status] }</td>          
          <td className="text-right">
            <UncontrolledDropdown>
              <DropdownToggle
                className="btn-icon-only text-light"
                href="#pablo"
                role="button"
                size="sm"
                color=""
                onClick={e => e.preventDefault()}
              >
                <i className="fas fa-ellipsis-v" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem
                  onClick={() => props.deleteManager(props.index)}
                >
                  Удалить
                </DropdownItem>
                <DropdownItem
                  onClick={() => props.editManager(props.index)}
                >
                  Изменить
                </DropdownItem>
                <DropdownItem
                  onClick={e => e.preventDefault()}
                >
                  Something else here
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
      </tr>
  )
}

export default Managers;