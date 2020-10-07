import React from 'react';

import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { request, getToken, getURL, setURL } from 'config';

import { Card,
  Container,
  Row,
  CardHeader,
  Form, Button,
  FormGroup,
  Input, CardBody, Alert
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";

class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      settings: {
        comandID: 0,
        crontime: "10_sec",
        durationClients: 5,
        durationManagers: 30,
        durationStart: 10,
        googleFolder: "1Jq0Kxw8KsnPNZNbf-QJZOed4BHo9uFeO",
        hostService: "0.0.0.0:8083",
        messageFailManager: "messageFailManager",
        messageFormAuth: "messageFormAuth",
        token: "000000000:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        updateID: 0,
      },
      alert: { open: false, color: 'danger', title: ''},
      domainAPI: getURL(),
    }
    this.handlerSave = this.handlerSave.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.changeToken = this.changeToken.bind(this);
    this.changeGoogleFolder = this.changeGoogleFolder.bind(this);
    this.changeHostService = this.changeHostService.bind(this);
    this.changeDurationClients = this.changeDurationClients.bind(this);
    this.changeDurationManagers = this.changeDurationManagers.bind(this);
    this.changeDomainAPI = this.changeDomainAPI.bind(this);
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
      map(res => res.response.data),
    ).subscribe(
      settings => this.setState({ settings: {...this.state.settings, ...settings }}), 
      err => console.log(err)
    )
  }
  handlerSave(e) {
    e.preventDefault();
    const button = e.target.querySelector('button');
    const { domainAPI, settings: { durationClients, durationManagers, 
      googleFolder, hostService, token } } = this.state;
    if(button) button.disabled = true;
    if(!/[0-9]{9}:[A-Za-z0-9]{35}/.test(token)){
      this.setError('Поле токена телеграмм бота не соответствует формату 000000000:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
      if(button) button.disabled = false;
      return;
    }
    if(googleFolder.length !== 33){
      this.setError('Поле папки гугл не соответствует формату')
      if(button) button.disabled = false;
      return;
    }
    if(hostService.length < 2){
      this.setError('Поле порта должно содержать как минимум 2 числа')
      if(button) button.disabled = false;
      return;
    }
    if(durationClients.length === 0){
      this.setError('Поле время реплики должно содержать как минимум 1 число')
      if(button) button.disabled = false;
      return;
    }
    if(durationManagers.length === 0){
      this.setError('Поле ответа менеджера должно содержать как минимум 1 число')
      if(button) button.disabled = false;
      return;
    }
    if(domainAPI.length === 0){
      this.setError('Поле URL сервиса должно содержать как минимум 1 число')
      if(button) button.disabled = false;
      return;
    }
    if(!/^(http|https):\/\/[^ "]+$/.test(domainAPI)){
      this.setError('Поле URL сервиса не соответствует URL адресу')
      if(button) button.disabled = false;
      return;
    } else {
      setURL(domainAPI);
    }
    const body = {...this.state.settings,
      hostService: `0.0.0.0:${hostService}`,
      durationClients: parseInt(durationClients, 10),
      durationManagers: parseInt(durationManagers, 10),
    }
    ajax({
      url: request(`settings`),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': getToken(),
      },
      body,
    }).pipe(
      map(res => res.response.success),
    ).subscribe(
      done => done ? this.setSuccess() : this.setError('Произошла ошибка сохранения'), 
      err => {this.setError('Произошла ошибка сохранения'); console.log(err)},
      () => { button.disabled = false }
    )
  }
  closeAlert(){
    this.setState({alert:{ open: false }})
  }
  setError(err) {
    this.setState({alert:{ open: true, color: 'danger', title: err }})
    setTimeout(this.closeAlert, 5000)
  }
  setSuccess() {
    this.setState({alert:{ open: true, color: 'success', title: 'Настройки успешно сохраненны' }})
    setTimeout(this.closeAlert, 5000)
  }
  changeToken(e){
    const token = e.target.value;
    if(/[А-Яа-я]/.test(token)) {
      this.setError('Поле токена телеграмм бота не должно содержать символы кирилицы!')
      return;
    }
    this.setState({ settings: { ...this.state.settings, token: token.slice(0,45) }})
  }
  changeGoogleFolder(e){
    const googleFolder = e.target.value;
    if(/[А-Яа-я]/.test(googleFolder)) {
      this.setError('Поле папки гугл не должно содержать символы кирилицы!')
      return;
    }
    this.setState({ settings: { ...this.state.settings, googleFolder: googleFolder.slice(0,33) }})
  }
  changeHostService(e){
    const hostService = e.target.value;
    if(/[A-Za-zА-Яа-я]+/.test(hostService)) {
      this.setError('Поле порта должно содержать только цифры!')
      return;
    }
    this.setState({ settings: { ...this.state.settings, hostService: hostService.slice(0,4) }})
  }
  changeDurationClients(e){
    const durationClients = e.target.value;
    if(/[A-Za-zА-Яа-я]+/.test(durationClients)) {
      this.setError('Поле время реплики должно содержать только цифры!')
      return;
    }
    this.setState({ settings: { ...this.state.settings, durationClients: durationClients.slice(0,4) }})
  }
  changeDurationManagers(e){
    const durationManagers = e.target.value;
    if(/[A-Za-zА-Яа-я]+/.test(durationManagers)) {
      this.setError('Поле ответа менеджера должно содержать только цифры!')
      return;
    }
    this.setState({ settings: { ...this.state.settings, durationManagers: durationManagers.slice(0,4) }})
  }
  changeDomainAPI(e) {
    const domainAPI = e.target.value;
    if(/https?\/\/:[A-Za-zА-Яа-я]+/.test(domainAPI)) {
      this.setError('Поле URL сервиса не соответствует домену!')
      return;
    }
    this.setState({ domainAPI })
  }
  
  render() {
    const { domainAPI, settings: { durationClients, durationManagers, 
      googleFolder, hostService, token }, alert:{ open, color, title} } = this.state;
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
                <Alert color={color} isOpen={open} toggle={this.closeAlert}>{title}</Alert>
                </CardHeader>
                <CardBody>
                <Form onSubmit={this.handlerSave}>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-username" >Токен телеграмм бота</label>
                    <Input
                      name="input-token"
                      className="form-control-alternative"
                      value={token}
                      onChange={this.changeToken}
                      placeholder="000000000:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      type="text"
                    />
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-firstname" >ID гугл папки</label>
                    <Input
                      name="input-googleFolder"
                      className="form-control-alternative"
                      value={googleFolder}
                      onChange={this.changeGoogleFolder}
                      placeholder="Введите ID гугл папки<"
                      type="text"
                    />
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-lastname" >Порт сервиса АПИ</label>
                    <Input
                      name="input-hostService"
                      className="form-control-alternative"
                      value={hostService.replace(/([\d].[\d].[\d].[\d]:)/g,'')}
                      onChange={this.changeHostService}
                      placeholder="Введите Порт сервиса АПИ"
                      type="text"
                    />
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-lastname" >Время ожидания реплики бота в секундах</label>
                    <Input
                      name="input-durationClients"
                      className="form-control-alternative"
                      value={durationClients}
                      onChange={this.changeDurationClients}
                      placeholder="Введите Время ожидания реплики бота в секундах"
                      type="text"
                    />
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-lastname" >Время ожидания ответа менеджера в секундах</label>
                    <Input
                      name="input-durationManagers"
                      className="form-control-alternative"
                      value={durationManagers}
                      onChange={this.changeDurationManagers}
                      placeholder="Введите Время ожидания ответа менеджера в секундах"
                      type="text"
                    />
                  </FormGroup>
                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-lastname" >URL сервиса</label>
                    <Input
                      name="input-domainAPI"
                      className="form-control-alternative"
                      value={domainAPI}
                      onChange={this.changeDomainAPI}
                      placeholder="Введите URL сервиса"
                      type="text"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button color="primary" 
                      className="form-control-alternative"
                      onSubmit={this.handlerSave}
                      type="subnit"
                    >Сохранить</Button>
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
