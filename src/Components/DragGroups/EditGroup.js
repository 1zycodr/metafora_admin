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
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
const managers = [
  {id:1, userID:2,	chatID:435274667, firstname:'Виталий', lastname:'Никонов', username:'N_Vitas', reghash:'1röÖr7', date:'2020-08-19 06:08:30',	status:2},
  {id:2, userID:3,	chatID:553603486, firstname:'Eugene', lastname:'Antonov', username:'', reghash:'6Å9qev', date:'2020-09-10 10:26:50',	status:2},
  {id:4, userID:4,	chatID:1233452136, firstname:'Olga', lastname:'Antonova', username:'', reghash:'SMESxÖ', date:'2020-09-10 10:31:19',	status:2},
  {id:5, userID:0,	chatID:1219646264, firstname:'Metafora_1', lastname:'', username:'', reghash:'ELH2cl', date:'2020-09-10 10:35:46',	status:1},
  {id:6, userID:0,	chatID:1255719428, firstname:'Анастасия',	lastname:'Тесленко', username:'', reghash:'7LpGS0', date:'2020-09-10 10:44:43',	status:1},
  {id:7, userID:0,	chatID:532031398, firstname:'Metafora_2', lastname:'', username:'', reghash:'B7145C', date:'2020-09-10 10:45:13',	status:1},
  {id:8, userID:0,	chatID:374090104, firstname:'Nursulu', lastname:'K', username:'', reghash:'6YWUÅv', date:'2020-09-10 10:59:34',	status:1},
  {id:9, userID:0,	chatID:800646519, firstname:'Полина', lastname:'', username:'', reghash:'pOBdÖa', date:'2020-09-10 11:03:16',	status:1}
];

class EditGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        group: props.group,
        selected: Array.from(managers),
        id2List: {
          boxone: 'managers',
          boxtwo: 'selected'
        },
        managers: [],
        searchManager: '',
        searchSelected: '',
    }
    this.onDragEnd = this.onDragEnd.bind(this);
    this.getList = this.getList.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeView = this.changeView.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.filterManagers = this.filterManagers.bind(this);
    this.filterSelector = this.filterSelector.bind(this);
  }
  componentWillMount() {
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
      manager => this.setState({selected: {...this.state.selected, manager }}), 
      err => {console.log(err); this.setState({ selected: managers })}
    )
  }
  componentWillReceiveProps(newProps){
    const newManagers = [];
    const newSelected = managers.filter(user => {
      if(newProps.group.managers.indexOf(user.id) !== -1) {
        newManagers.push(user)
        return false
      }
      return true;
    })
    this.setState({ group: newProps.group, selected: newSelected, managers: newManagers })
  }
  getItemStyle(isDragging, draggableStyle) {
    if(draggableStyle.left > 0) {
      draggableStyle.left -= 300
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
  createGroup() {
    const { group } = this.state;
    const { saveGroup, toggle } = this.props;
    if(typeof saveGroup === 'function') {
      saveGroup(group);
    } else {
      toggle();
    }
  }
  filterSelector(e){
    // const selected = this.state.selected.filter(manager => manager.firstname.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
    this.setState({ searchSelected: e.target.value });
  }
  filterManagers(e){
    // const managers = this.state.managers.filter(manager => manager.firstname.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
    this.setState({ searchManager: e.target.value });
  }
  render() {
    const { group: { title, view }, searchSelected, searchManager } = this.state;
    const { modal, toggle } = this.props;
    return (
      <Modal size="lg" isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Новая группа</ModalHeader>
        <ModalBody>
          <FormGroup>
            <label
              className="form-control-label"
            >
              Название новой группы
            </label>
            <Input
              className="form-control-alternative"
              value={title}
              onChange={this.changeTitle}
              placeholder="Введите название новой группы"
              type="text"
            />
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
          <hr/>
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