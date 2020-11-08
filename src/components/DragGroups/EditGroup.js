import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ajax } from 'rxjs/ajax';
import { switchMap } from 'rxjs/operators';
import { request, getToken } from 'config';

// reactstrap components
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Button,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

class EditGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        group: props.group,
        groups: props.groups,
        selected: [],
        list: [],
        id2List: {
          boxone: 'managers',
          boxtwo: 'selected'
        },
        managers: [],
        searchManager: '',
        searchSelected: '',    
        first: [],
        second: [],
    }
    this.onDragEnd = this.onDragEnd.bind(this);
    this.getList = this.getList.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeView = this.changeView.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.fetchManagers = this.fetchManagers.bind(this);
    this.filterManagers = this.filterManagers.bind(this);
    this.filterSelector = this.filterSelector.bind(this);
    this.changeFirstGroup = this.changeFirstGroup.bind(this);
    this.changeSecondGroup = this.changeSecondGroup.bind(this);
  }
  componentWillMount() {
    // Подготавка списков
    this.prepareSelectList(this.props.group.id)
    this.fetchManagers();
  }
  fetchManagers(){
    const list = [];
    const group = this.props.group;
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
      manager => list.push(manager),
      err => console.log(err),
      () => {
        const managers = [];
        const selected = list.filter(user => {
          if(group.managers.indexOf(user.id) !== -1) {
            managers.push(user)
            return false
          }
          return true;
        })
        this.setState({
          list,
          managers,
          selected
        })
      }
    )
  }
  getItemStyle(isDragging, draggableStyle) {
    const body = document.body;
    const ofs = (body.clientWidth - 800) / 2;
    if(isDragging) {
      draggableStyle.left = draggableStyle.left - ofs;
    }
    return {
      // some basic styles to make the items look a bit nicer
      userSelect: "none",
      padding: 10,
      margin: `0 0 15px 0`,

      // change background colour if dragging
      background: isDragging ? "#5e72e4" : "white",
      color: isDragging ? "#ffffff" : "#525f7f",
      boxShadow: '0 15px 35px rgba(50, 50, 93, 0.2), 0 5px 15px rgba(0, 0, 0, 0.17)',
      borderRadius: 5,

      // styles we need to apply on draggables
      ...draggableStyle
    }
  }

  getListStyle(isDraggingOver) {
    return {
      background: isDraggingOver ? "lightgrey" : "#eeeeee",
      padding: 10,
      width: '50%',
      display: 'inline-box',
      float: 'left',
      borderRadius: 10,
      maxHeight: 400,
      overflow: 'auto'
    }
  }
  reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }
  getList(droppableID) {
    return this.state[this.state.id2List[droppableID]];
  }
  move(source, destination, droppableSource, droppableDestination) {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
  }
  onDragEnd(result) {
    const { source, destination } = result;
    const { group } = this.state;
    // dropped outside the list
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const items = this.reorder(
          this.getList(source.droppableId),
          source.index,
          destination.index
      );
      let state = {...this.state, managers: items}
      if (source.droppableId === 'boxtwo') {
        state = {...this.state, selected: items};
      }
      this.setState(state);
    } else {
      const result = this.move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
      );
      group.managers = result.boxone.map(m => m.id)
      this.setState({ 
        managers: result.boxone,
        selected: result.boxtwo,
        searchManager: '',
        searchSelected: '',
        group
      });
    }
  }
  changeTitle(e) {
    const { group } = this.state;
    group.title = e.target.value;
    this.setState({ group });
  }
  changeView(e) {
    const { group } = this.state;
    group.view = !group.view;
    this.setState({ group });
  }

  saveChild(group) {
    const { saveGroup } = this.props;
    const parent = group.parent;
    let url = request(`group/update`);
    // Сохранение в беке
    ajax({
      url,
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
          saveGroup({...res.response.data, parent})
        } else {
          console.log('Ошибка запроса', res)
          saveGroup(group)
        }
      },
      error => console.log(error)
    )
  }

  createGroup() {
    const { group, first, second } = this.state;
    const { toggle, getGroups } = this.props;
    let url = request(`group/create`);
    if(group.id){
      url = request(`group/update`);
    }
    // Сохранение в беке
    ajax({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': getToken(),
      },
      body: {...group, view: group.view ? 1 : 0, first: first.selected, second: second.selected }
    })
    .subscribe(
      res => {
        if(res.response.success) {
          getGroups();
          toggle();
        } else {
          console.log('Ошибка запроса', res)
          toggle();
        }
      },
      error => console.log(error)
    )
  }

  filterSelector(e){
    this.setState({ searchSelected: e.target.value });
  }

  filterManagers(e){
    this.setState({ searchManager: e.target.value });
  }

  // Список матрешки 1 - го уровня
  prepareSelectList(id){
    const select = {
      groups: [],
      selected: 0,
    };
    this.state.groups.forEach(group => {
      // В списке должны быть родители без дочерних групп
      if(group.parent.length === 0) {
        select.groups.push(group);
        return
      }
      // В списке должны быть все дочерние группы и внучатые группы кроме внука ролителя
      group.parent.forEach(child => {
        // Отмечаем текущую дочерную группу как уже выбранного
        if(child.parentID === id) {
          select.selected = child.id
        }
        // Если внука нет то просто добавляем дочернюю группу
        if (child.parent.length === 0){
          select.groups.push(child)
          return
        }
        // Выборка внуков кроме вложенного в дочерную
        child.parent.forEach(grandson => {
          if(grandson.parentID !== select.selected){
            select.groups.push(grandson)
          }
        })
        select.groups.push(child)
      });
    })
    this.setState({ first: select })
    this.prepareSecondSelectList(select.selected)
  }
  // Список матрешки 2 - го уровня
  prepareSecondSelectList(id){
    const select = {
      groups: [],
      selected: 0,
    };
    this.state.groups.forEach(group => {
      // В списке должны быть родители без дочерних групп
      if(group.parent.length === 0) {
        if (group.id !== id) {
          select.groups.push(group);
        }
        return;
      }
      // В списке должны быть все дочерние группы без внуков и внучатые группы родителя внука
      group.parent.forEach(child => {
        // Если внука нет то просто добавляем дочернюю группу
        if (child.parent.length === 0){
          if(child.id !== id) {
            select.groups.push(child);
          }
          return;
        }
        // Выборка внуков кроме вложенного в дочерную
        child.parent.forEach(grandson => {
          if(grandson.parentID === id){
            select.selected = grandson.id;
          } 
          select.groups.push(grandson);
        })
      });
    })
    this.setState({ second: select })
  }
  // Изменение группы первого уровня
  changeFirstGroup(event) {
    const id = parseInt(event.target.value, 10) || 0
    const { first } = this.state;
    // Смена групы 1-го уровня
    first.selected = id
    this.setState({ first })
  }
  changeSecondGroup(event) {
    const id = parseInt(event.target.value, 10) || 0
    const { second } = this.state;
    // Смена групы 2-го уровня
    second.selected = id
    this.setState({ second })
  }

  render() {
    const { group: {title, view}, searchSelected, searchManager, first, second } = this.state;
    const { modal, toggle } = this.props;
    return (
      <Modal size="lg" isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Новая группа</ModalHeader>
        <ModalBody>
          <div ref={e => this.wrapRef = e}>
            <FormGroup>
              <Label for="title">Название группы</Label>
              <Input
                className="form-control-alternative"
                value={title}
                onChange={this.changeTitle}
                placeholder="Введите название группы"
                type="text"
                id="title"
              />
            </FormGroup>
            <FormGroup>
              <Label for="firstLevel">Следущая группа 1-го уровня</Label>
              <Input 
                id="firstLevel"
                defaultValue={first.selected}
                onChange={this.changeFirstGroup}
                type="select"
                disabled={second.selected > 0}
              >
                <option value="default">Не выбрана</option>
                {
                  first.groups.map(group => <option key={group.id} value={group.id}>{group.title}</option>)
                }
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="secondLevel">Следущая группа 2-го уровня</Label>
              <Input 
                id="secondLevel"
                defaultValue={second.selected}
                onChange={this.changeSecondGroup}
                disabled={first.selected === 0}
                type="select"
              >
                <option value="default">Не выбрана</option>
                {
                  second.groups.map(group => <option key={group.id} value={group.id}>{group.title}</option>)
                }
              </Input>
            </FormGroup>
            <FormGroup check>
              <label
                className="form-control-label"
              >
                <Input
                  className="form-control-alternative"
                  name="view"
                  checked={view}
                  onChange={this.changeView}
                  type="checkbox"
                />
                Показывать в вопросе бота из какого вы города
              </label>
            </FormGroup>
            <FormGroup check>
              <label
                className="form-control-label"
              >Перетащите менеджера в необходимый блок</label>
            </FormGroup>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="boxone">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={this.getListStyle(snapshot.isDraggingOver)}>
                    <h3>Менеджеры в группе</h3>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fas fa-search" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Поиск менеджера" value={searchManager} onChange={this.filterManagers} type="text" />
                      </InputGroup>
                    </FormGroup>
                    {this.state.managers.filter(manager => manager.firstname.toLowerCase()
                    .indexOf(searchManager.toLowerCase()) !== -1).map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={`draggableId-${item.id}`}
                        index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={this.getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}>
                            {item.firstname}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId="boxtwo">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={this.getListStyle(snapshot.isDraggingOver)}>
                    <h3>Менеджеры вне группы</h3>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fas fa-search" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Поиск менеджера" value={searchSelected} onChange={this.filterSelector} type="text" />
                      </InputGroup>
                    </FormGroup>
                    {this.state.selected.filter(manager => manager.firstname.toLowerCase()
                    .indexOf(searchSelected.toLowerCase()) !== -1).map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={`draggableId-${item.id}`}
                        index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={this.getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}>
                            {item.firstname}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>            
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.createGroup}>Сохранить</Button>{' '}
          <Button color="secondary" onClick={toggle}>Отмена</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default EditGroup;