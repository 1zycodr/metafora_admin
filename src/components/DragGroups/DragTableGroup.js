import React from "react";
import { ajax } from 'rxjs/ajax';
import { request, getToken } from 'config';
import { groupBy, map, mergeMap, reduce } from 'rxjs/operators';
import { Button, Table, Alert } from "reactstrap";
import EditGroup from './EditGroup';
import moment from 'moment';
import { switchMap } from 'rxjs/operators';
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
      selectGroup: defaultGroup,
    }
    this.onDragEnd = this.onDragEnd.bind(this);
    this.getList = this.getList.bind(this);
    this.toggle = this.toggle.bind(this);
    this.changeGroup = this.changeGroup.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.saveGroup = this.saveGroup.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }
  toggle() {
    this.setState({ modal: !this.state.modal, selectGroup: defaultGroup })
  }

  move(source, destination, droppableSource, droppableDestination) {
    const sourceClone = Array.from(source[0].parent);
    const destClone = Array.from(destination[0].parent);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);

    const sourceId = parseInt(droppableSource.droppableId.replace(/\D+/,''), 10)
    const destinationId = parseInt(droppableDestination.droppableId.replace(/\D+/,''), 10)

    const groups = this.state.groups.map(group => {
      if(group.id === sourceId) {
        group.parent = sourceClone.map(item => {
          if(item.parentID !== sourceId) {
            item.parentID = sourceId;
            this.moveServer(item);
          }
          return item;
        })
      }
      if(group.id === destinationId) {
        group.parent = destClone.map(item => {
          if(item.parentID !== destinationId) {
            item.parentID = destinationId;
            this.moveServer(item);
          }
          return item;
        })
      }
      return group;
    });
    return groups;
  }
  exitGroup(source) {
    let newgroup = false;
    const sourceId = parseInt(source.droppableId.replace(/\D+/,''), 10)
    const groups = this.state.groups.map(group => {
      if(group.id === sourceId) {
        [newgroup] = group.parent.splice(source.index, 1);
      }
      return group;
    });
    if(newgroup){
      newgroup.parentID = 0;
      this.moveServer(newgroup);
      groups.push(newgroup)
    }
    this.setState({ groups });
  }
  reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }
  getList(droppableID) {
    return this.state.groups.filter(group => {
      if(group.id === parseInt(droppableID.replace(/\D+/,''), 10)) {
        return true;
      }
      return false
    })
  }
  moveRoot(result) {
    const { source, destination, draggableId } = result;
    const groupID = parseInt(draggableId.replace(/\D+/,''), 10)
    // Смена групп местами
    if(source.droppableId === destination.droppableId){
      const groups = this.reorder(
          this.state.groups,
          source.index,
          destination.index
      );
      this.setState({ groups });
      return
    }
    // Из дочернего в родительский
    if(destination.droppableId === 'root') {
      let newgroup = false;
      const sourceId = parseInt(source.droppableId.replace(/\D+/,''), 10)
      const groups = this.state.groups.map(group => {
        if(group.id === sourceId) {
          [newgroup] = group.parent.splice(source.index, 1);
        }
        return group;
      });
      if(newgroup){
        newgroup.parentID = 0;
        this.moveServer(newgroup);
        groups.push(newgroup)
      }
      this.setState({ groups });
      return
    }
    // Из родительской в дочерний
    if(source.droppableId === 'root') {
      const moveId = parseInt(destination.droppableId.replace(/\D+/,''), 10)
      if(moveId === groupID) {
        return;
      }
      const sourceClone = Array.from(this.state.groups);
      const childs = this.getList(destination.droppableId)
      const destClone = Array.from(childs[0].parent);
      const [removed] = sourceClone.splice(source.index, 1);
      destClone.splice(destination.index, 0, removed);
      const groups = sourceClone.map(group => {
        if(group.id === moveId) {
          this.moveServer(group);
          const parent = destClone.map(item => {
            if(item.parentID !== moveId) {
              item.parentID = moveId;
              this.moveServer(item);
            }
            return item;
          })
          group.parent = parent;
        }
        return group;
      });
      this.setState({ groups });
      return;
    }
  }
  moveServer(group) {
    console.log('moveServer', group);
    ajax({
      url: request(`group/update`),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': getToken(),
      },
      body: {...group, view: group.view ? 1 : 0 }
    })
    .subscribe(
      res => {
        if(!res.response.success) {
          this.setState({alert:{ open: true, color: 'danger', title: 'Ошибка переноса группы'}})
        }
      },
      error => console.log(error)
    )
  }
  onDragEnd(result) {
    const { source, destination } = result;
    if(source.droppableId === 'root') {
      if (!destination) {
        return;
      }
      this.moveRoot(result);
      return;
    }
    // dropped outside the list
    if (!destination) {
      this.exitGroup(source)
      return;
    }
    if(destination.droppableId === 'root') {
      this.moveRoot(result);
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const items = this.getList(source.droppableId);
      items[0].parent = this.reorder(
          items[0].parent,
          source.index,
          destination.index
      );
      const groups = this.state.groups.map(group => {
        if(group.id === items[0].id) {
          group.parent = items[0].parent
        }
        return group;
      });
      this.setState({ groups });
    } else {
      const groups = this.move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
      );
      this.setState({ groups });
    }
  }
  changeGroup(group) {
    this.setState({ selectGroup: group, modal: true });
  }

  reloadGroups() {
    const result = { first: [], last: [] };
    ajax({
      url: request(`group`),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': getToken()
      }
    }).pipe(
      switchMap(res => res.response.data),
      map(group => {
        return {...group, parent: []}
      }),
      groupBy(group => group.parentID === 0),
      mergeMap(group$ =>
        group$.pipe(reduce((acc, cur) => [...acc, cur], [`${group$.key}`]))
      ),
    )
    .subscribe(
      arr => {
        if(arr[0] === "true") {
          result.first =  arr.slice(1);
        } else {
          result.last = arr.slice(1);
        }
      },
      error => console.log(error),
      () => {
        const groups = result.first.map(group => {
          result.last.forEach(last => {
            result.last.forEach(lst => {
              if (last.id === lst.parentID && last.parent.length === 0) {
                last.parent.push(lst)
              }
            })
            if(group.id === last.parentID){
              group.parent.push(last);
            }
          })
          return group;
        })
        this.setState({ groups })
      },
    )
  }
  // сохранение или создание группы
  saveGroup(group) {
    this.reloadGroups()
  }
  deleteGroup(group) {
    if(group.parent.length > 0) {
      this.setState({alert:{ open: true, color: 'danger', title: 'Нельзя удалить группу с подгруппами'}})
      return
    }
    ajax({
      url: request(`group/delete`),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': getToken(),
      },
      body: {...group, view: group.view ? 1 : 0 }
    })
    .subscribe(
      res => {
        if(res.response.success) {
          const groups = this.state.groups.filter(item => {
            if(item.id === group.id) {
              return false;
            }
            item.parent = item.parent.filter(child => {
              if(child.id === group.id) {
                return false;
              }
              return true;
            })
            return true;
          })
          this.setState({ modal: false, groups })
        } else {
          this.setState({alert:{ open: true, color: 'danger', title: 'Не удалось удалить группу'}});
        }
      },
      () => this.setState({alert:{ open: true, color: 'danger', title: 'Не удалось удалить группу'}})
    )
  }
  closeAlert(){
    this.setState({alert:{ open: false, color: 'danger', title: ''}})
  }

  render() {
    const { modal, selectGroup, alert:{ open, color, title} } = this.state;
    const { groups } = this.state;

    return (
      <>
        {modal ? (
          <EditGroup 
            modal={modal}
            toggle={this.toggle}
            group={selectGroup}
            groups={this.state.groups}
            saveGroup={this.saveGroup}
            controller={ this.props.controller }
          />
        ) : (<></>)}
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