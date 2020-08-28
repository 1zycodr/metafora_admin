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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Button,
  Input,
} from "reactstrap";

class DragTableGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groups: this.props.groups,
      modal: false,
      newTitle: "",
    }
    this.onDragEnd = this.onDragEnd.bind(this);
    this.getList = this.getList.bind(this);
    this.toggle = this.toggle.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.createGroup = this.createGroup.bind(this);
    
  }
  toggle() {
    this.setState({ modal: !this.state.modal })
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
      width: 250
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
  changeTitle(e) {
    this.setState({ newTitle: e.target.value });
  }
  createGroup() {
    const { newTitle, groups } = this.state;
    let id = 0;
    if(newTitle.length > 0) {
      for(const group of groups) {
        if(group.title === newTitle) {
          id = 0
          return
        }
        if(group.id > id) {
          id = group.id;
        }
        for(const parent of group.parent) { 
          if(parent.id > id) {
            id = parent.id;
          }
        }
      };
    }
    if(id > 0) {
      groups.push({ id:id+1, parent:[], parentID:0,	name: `newGroup${id+1}`,	title: newTitle, view: 1,	date: "2020-08-19 05:12:30",	status: 1 })
    }
    this.setState({ newTitle: "", modal: false, groups});
  }
  render() {
    const { modal, newTitle } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Modal isOpen={modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Новая группа</ModalHeader>
          <ModalBody>
            <FormGroup>
              <label
                className="form-control-label"
                htmlFor="input-username"
              >
                Название новой группы
              </label>
              <Input
                className="form-control-alternative"
                value={newTitle}
                onChange={this.changeTitle}
                placeholder="Введите название новой группы"
                type="text"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.createGroup}>Создать</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Отмена</Button>
          </ModalFooter>
        </Modal>
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
                            href="#pablo"
                            onClick={this.toggle}
                          >
                            Добавить новую группу
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  {this.state.groups.filter(group => (group.parentID === 0)).map((item, index) => (
                    <Draggable key={`item-${item.id}`} draggableId={`item-${item.id}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          className="draggableContext col-2"
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
                    <h3 className="mb-0">{group.title}</h3>
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
        ))}
      </DragDropContext>
    )
  }
}

export default DragTableGroup;