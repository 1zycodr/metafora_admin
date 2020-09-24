import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Col,
  Row,
  Button,
  Badge,
  Alert
} from "reactstrap";
import EditGroup from './EditGroup';
import moment from 'moment';

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
    this.saveGroup = this.saveGroup.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }
  toggle() {
    this.setState({ modal: !this.state.modal, selectGroup: defaultGroup })
  }
  getItemStyle(isDragging, draggableStyle) {
    return {
      // some basic styles to make the items look a bit nicer
      userSelect: "none",
      padding: 15,
      margin: `0 0 15px 0`,

      // change background colour if dragging
      background: isDragging ? "lightgreen" : "grey",

      // styles we need to apply on draggables
      ...draggableStyle
    }
  }

  getListStyle(isDraggingOver) {
    return {
      background: isDraggingOver ? "lightblue" : "lightgrey",
      padding: 15,
      width: '33.33%',
    }
  }
  getHorizontListStyle(isDraggingOver) {
    return {
      background: isDraggingOver ? 'lightblue' : 'lightgrey',
      display: 'flex',
      padding: 15,
      overflow: 'auto',
    }
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
        group.parent = sourceClone.map(item => ({...item, parentID: sourceId}))
      }
      if(group.id === destinationId) {
        group.parent = destClone.map(item => ({...item, parentID: destinationId}))
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
          const parent = destClone.map(item => ({...item, parentID: moveId}))
          group.parent = parent;
        }
        return group;
      });
      this.setState({ groups });
      return;
    }
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
  // сохранение или создание группы
  saveGroup(group) {
    if(group.id) {
      this.setState({ modal: false });
    } else {
      const { groups } = this.state;
      groups.forEach(item => {
        if(item.id > group.id) {
          group.id = item.id
        }
        item.parent.forEach(child => {
          if(child.id > group.id) {
            group.id = child.id
          } 
        })
      })
      group.id = group.id + 1;
      groups.push(group);
      console.log(groups, group);
      this.setState({ modal: false, groups, selectGroup: defaultGroup });
    }
  }
  deleteGroup(group) {
    console.log(group)
    if(group.parent.length > 0) {
      this.setState({alert:{ open: true, color: 'danger', title: 'Нельзя удалить группу с подгруппами'}})
      return
    }
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
  }
  closeAlert(){
    this.setState({alert:{ open: false, color: 'danger', title: ''}})
  }
  render() {
    const { modal, selectGroup, alert:{ open, color, title} } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <EditGroup 
          modal={modal}
          toggle={this.toggle}
          group={selectGroup}
          saveGroup={this.saveGroup}
        />
        <Alert color={color} isOpen={open} toggle={this.closeAlert}>{title}</Alert>
        <Droppable key="root" droppableId="root" direction="horizontal">
          {(provided, snapshot) => (
            <div className="dragDropHorisontContext"
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={this.getHorizontListStyle(snapshot.isDraggingOver)}
            >
              <Card className="shadow col">
                <CardHeader className="border-1">
                  <Row>
                    <Col className="col-11">
                      <h3 className="mb-0">Родительские группы</h3>
                    </Col>
                    <Col className="text-right col-1">
                      <Button 
                        color="success"
                        onClick={this.toggle}
                        style={{borderRadius: '50%'}}
                        size="sm">
                          <i className="ni ni-fat-add" />
                        </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  {this.state.groups.filter(group => (group.parentID === 0)).map((item, index) => (
                    <Draggable key={`item-${item.id}`} draggableId={`item-${item.id}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          className="draggableContext col-3"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          // style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                          <Card className="card-stats mb-4 mb-xl-0">
                            <CardHeader className="border-0">
                              <h3 className="mb-0">{item.title}</h3>
                            </CardHeader>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </CardBody>
              </Card>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {this.state.groups.map((group, index) => (
          <Droppable key={`droppable-${group.id}`} droppableId={`droppable-${group.id}`}>
            {(provided, snapshot) => (
              <div className="dragDropContext"
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={this.getListStyle(snapshot.isDraggingOver)}
              >
                <Card className="shadow">
                  <CardHeader className="border-0">
                    <Row>
                      <Col className="col-10">
                        <h3 className="mb-0">{group.title}</h3>
                      </Col>
                      <Col className="text-right col-2">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#menu"
                            role="button"
                            size="sm"
                            color=""
                            onClick={e => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                              onClick={() => this.changeGroup(group)}
                            >
                              Изменить группу
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => this.deleteGroup(group)}
                            >
                              Удалить группу
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="col-6">
                        {group.view ? <Badge color="success" pill>Публичная</Badge> : <Badge color="light" pill>Приватная</Badge>}
                      </Col>
                      <Col className="col-6">
                        <Badge color="primary" pill>Менеджеров {group.managers.length}</Badge>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody className="pt-0 pt-md-4">
                    {group.parent.map((item, index) => (
                      <Draggable key={`item-${item.id}`} draggableId={`item-${item.id}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            // style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <Card className="shadow">
                              <CardHeader className="border-0">
                                <Row>
                                  <Col className="col-10">
                                    <h3 className="mb-0">{item.title}</h3>
                                  </Col>
                                  <Col className="text-right col-2">
                                    <UncontrolledDropdown>
                                      <DropdownToggle
                                        className="btn-icon-only text-light"
                                        href="#menu"
                                        role="button"
                                        size="sm"
                                        color=""
                                        onClick={e => e.preventDefault()}
                                      >
                                        <i className="fas fa-ellipsis-v" />
                                      </DropdownToggle>
                                      <DropdownMenu className="dropdown-menu-arrow" right>
                                        <DropdownItem
                                          onClick={() => this.changeGroup(item)}
                                        >
                                          Изменить группу
                                        </DropdownItem>
                                        <DropdownItem
                                          onClick={() => this.deleteGroup(item)}
                                        >
                                          Удалить группу
                                        </DropdownItem>
                                      </DropdownMenu>
                                    </UncontrolledDropdown>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col className="col-6">
                                    {item.view ? <Badge color="success" pill>Публичная</Badge> : <Badge color="light" pill>Приватная</Badge>}
                                  </Col>
                                  <Col className="col-6">
                                    <Badge color="primary" pill>Менеджеров {item.managers.length}</Badge>
                                  </Col>
                                </Row>
                              </CardHeader>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </CardBody>
                </Card>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    )
  }
}

export default DragTableGroup;