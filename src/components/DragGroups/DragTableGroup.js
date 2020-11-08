import React from "react";
import { ajax } from 'rxjs/ajax';
import { request, getToken } from 'config';
import { Button, Table, Alert, Modal, ModalHeader, ModalBody, ModalFooter, } from "reactstrap";
import EditGroup from './EditGroup';
import moment from 'moment';
import TableGroup from './TableGroup';

const defaultGroup = {
  id: 0,
  parent: [],
  parentID: 0,
  name: 'group',
  title: '',
  view: false,
  date: moment().format('YYYY-MM-DD HH-mm-ss'),
  managers: [],
}
class DragTableGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      alert: { open: false, color: 'danger', title: ''},
      groups: this.props.groups,
      modal: false,
      confirm: false,
      selectGroup: defaultGroup,
    }
    this.toggle = this.toggle.bind(this);
    this.ok = this.ok.bind(this);
    this.cancel = this.cancel.bind(this);
    this.changeGroup = this.changeGroup.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }
  toggle() {
    this.setState({ modal: !this.state.modal, confirm: false, selectGroup: defaultGroup })
  }
  changeGroup(group) {
    this.setState({ selectGroup: group, modal: true });
  }
  deleteGroup(group) {
    if(group.parent.length > 0) {
      this.setState({alert:{ open: true, color: 'danger', title: 'Нельзя удалить группу с подгруппами'}})
      return
    }
    this.setState({ confirm: true, selectGroup: group });
  }
  ok(){
    const { selectGroup } = this.state;
    ajax({
      url: request(`group/delete`),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': getToken(),
      },
      body: {...selectGroup, view: selectGroup.view ? 1 : 0 }
    })
    .subscribe(
      res => {
        if(res.response.success) {
          const groups = this.state.groups.filter(item => {
            if(item.id === selectGroup.id) {
              return false;
            }
            item.parent = item.parent.filter(child => {
              if(child.id === selectGroup.id) {
                return false;
              }
              return true;
            })
            return true;
          })
          this.setState({ confirm: false, groups })
        } else {
          this.setState({confirm: false, alert:{ open: true, color: 'danger', title: 'Не удалось удалить группу'}});
        }
      },
      () => this.setState({confirm: false, alert:{ open: true, color: 'danger', title: 'Не удалось удалить группу'}})
    )
  }
  cancel() {
    this.setState({ confirm: false });
  }
  closeAlert(){
    this.setState({alert:{ open: false, color: 'danger', title: ''}})
  }
  renderModal() {
    const { modal } = this.state;
    if(modal){
      return this.renderEdit();
    }
    return null;
  }
  renderEdit(){
    const { modal, selectGroup, groups } = this.state;
    return <EditGroup 
      modal={modal}
      toggle={this.toggle}
      group={selectGroup}
      groups={groups}
      getGroups={this.props.getGroups}
    />
  }
  render() {
    const { groups, alert:{ open, color, title}, confirm, selectGroup } = this.state;
    return (
      <>
        <Modal size="lg" isOpen={confirm} toggle={this.cancel}>
          <ModalHeader toggle={this.cancel}>Удаление группы</ModalHeader>
          <ModalBody><p>Вы действительно желаете удалить группу {selectGroup.title}?</p></ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.ok}>Удалить</Button>{' '}
            <Button color="secondary" onClick={this.cancel}>Отмена</Button>
          </ModalFooter>
        </Modal>
        {this.renderModal()}
        <Alert color={color} isOpen={open} toggle={this.closeAlert}>{title}</Alert>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th>Имя</th>
              <th>Название</th>
              <th>Тип</th>
              <th>Менеджеры</th>
              <th>Дочерние группы</th>
              <th className="text-right" scope="col">
                <Button 
                color="success"
                onClick={this.toggle}
                style={{borderRadius: '50%'}}
                size="sm">
                  <i className="ni ni-fat-add" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              groups.map(
                (group, index) => {
                  return (<TableGroup 
                    group={ group }
                    name={ group.name }
                    title={ group.title }
                    type={ group.view ? 'Публичная' : 'Приватная' }
                    managers={ group.managers.length === 0 ? 'Отсутствуют' : group.managers.length }
                    daughter={ group.parent.length === 1 ? (group.parent[0].parent.length === 1 ? 2 : 1) : 'Отсутствуют' }
                    key={ index }
                    deleteGroup={ this.deleteGroup }
                    changeGroup={ this.changeGroup }
                  />)
                }
              )
            }
          </tbody>
        </Table>
      </>
    )
  }
}

export default DragTableGroup;