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

class EditGroup extends React.Component {
  constructor(props) {
    super(props)
    let firstChild = props.group.parent.length === 0 ? false : props.group.parent[0]
    let secondChild = firstChild ? (firstChild.parent.length === 0 ? false : firstChild.parent[0]) : false

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
        firstChild: firstChild,
        secondChild: secondChild,
        canEditFirst: !secondChild,
        canEditSecond: firstChild !== false,
    }

    // this.state.firstChild = group.parent.length === 0 ? false : group.parent[0];
    // this.state.secondChild = ;
    // this.state.canEditFirst = !this.state.secondChild 
    // this.state.canEditSecond = (this.state.firstChild !== false)

    this.onDragEnd = this.onDragEnd.bind(this);
    this.getList = this.getList.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeView = this.changeView.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.filterManagers = this.filterManagers.bind(this);
    this.filterSelector = this.filterSelector.bind(this);
    this.switchFirst = this.switchFirst.bind(this);
    this.switchSecond = this.switchSecond.bind(this);
  }
  componentWillMount() {
    const { selected } = this.props.controller.getFirstSelectList(this.props.group.id)
    this.props.controller.getSecondSelectList(selected)
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
      manager => {
        const list = [...this.state.list, manager]
        this.setState({selected: list, list})
      }
    )
  }
  componentWillReceiveProps(newProps){
    const newManagers = [];
    const newSelected = this.state.list.filter(user => {
      if(newProps.group.managers.indexOf(user.id) !== -1) {
        newManagers.push(user)
        return false
      }
      return true;
    })
    this.setState({ group: newProps.group, selected: newSelected, managers: newManagers })
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

  createGroup(f=false) {
    const { group } = this.state;
    const { saveGroup, toggle } = this.props;
    const parent = group.parent;
    if(typeof saveGroup === 'function') {
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
        body: {...group, view: group.view ? 1 : 0 }
      })
      .subscribe(
        res => {
          if(res.response.success) {
            saveGroup({...res.response.data, parent})
            toggle();
          } else {
            console.log('Ошибка запроса', res)
            saveGroup(group)
            toggle();
          }
        },
        error => console.log(error)
      )
    } else {
      toggle();
    }
  }

  filterSelector(e){
    this.setState({ searchSelected: e.target.value });
  }

  filterManagers(e){
    this.setState({ searchManager: e.target.value });
  }
  
  switchFirst(e) {
    const id = e.target.value === "default" ? false : parseInt(e.target.value, 10)
    let { canEditFirst, firstChild, group, groups, canEditSecond } = this.state;
    console.log(groups)

    if (canEditFirst) {
      if (firstChild) {
        if (id) {
          firstChild.parent = []
          firstChild.parentID = 0
          groups.push(firstChild)
          this.saveChild(firstChild, true)

          firstChild = {...groups.filter((gr) => gr.id === id)[0]}
          groups = groups.filter((gr) => gr.id !== id)

          firstChild.parentID = group.id
          group.parent = [firstChild]

          this.setState({group, groups, firstChild})
          this.saveChild(firstChild, true)
          this.saveChild(group, true)
        } else {
          firstChild.parent = []
          firstChild.parentID = 0
          groups.push(firstChild)
          canEditSecond = false
          group.parent = []

          this.setState({group, firstChild, canEditSecond})
          this.saveChild(firstChild, true)
          this.saveChild(group, true)
        }
      } else {
        firstChild = {...groups.filter((gr) => gr.id === id)[0]}
        groups = groups.filter((gr) => gr.id !== id)

        firstChild.parentID = group.id
        group.parent = [firstChild]
        canEditSecond = true

        this.setState({group, groups, firstChild, canEditSecond})
        this.saveChild(firstChild, true)
        this.saveChild(group, true)
      }
    } else {
      e.target.value = firstChild.id
    }
  }

  switchSecond() {

  }
  
  render() {
    const { group: {title, view}, searchSelected, searchManager, groups, group} = this.state;
    const { modal, toggle } = this.props;
    const selStyle = {
      maxWidth: '475px',
      marginTop: '20px'
    };
    

    const { firstChild, secondChild, canEditFirst, canEditSecond } = this.state

    return (
      <Modal size="lg" isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Новая группа</ModalHeader>
        <ModalBody>
          <div ref={e => this.wrapRef = e}>
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
            
          </div>

          <div style={selStyle}>
            
            <label
                  className="form-control-label"
                >Первая группа</label>
                <select readOnly={ !canEditFirst } defaultValue={ firstChild ? firstChild.id : "default"} className="form-control" data-toggle="select" title="Simple select" data-live-search="true" data-live-search-placeholder="Search ..." onChange={this.switchFirst}>
                  {
                    firstChild ?
                    <>
                      <option value="default">Не выбрана</option>
                      <option value={ firstChild.id }>{ firstChild.title }</option>
                    </> :
                    <option value="default">Не выбрана</option> 
                  }
                  {
                    groups.filter((gr) => 
                      (gr.parentID === 0 && gr.parent.length === 0 && gr.id !== group.id))
                      .map(
                        (g, index) => (
                          <option value={g.id} key={index}>{ g.title }</option>
                        )
                      )
                  }
                </select>
                <label
                  className="form-control-label"
                >Вторая группа</label>
                <select readOnly={ !canEditSecond } defaultValue={ secondChild ? secondChild : "default" } className="form-control" data-toggle="select" title="Simple select" data-live-search="true" data-live-search-placeholder="Search ..." onChange={this.switchSecond}>
                  {
                    secondChild ?
                    <>
                      <option value="default">Не выбрана</option>
                      <option value={ secondChild }>{ secondChild.title }</option>
                    </> :
                    <option value="default">Не выбрана</option> 
                  }
                  {
                    groups.filter((gr) => 
                      (gr.parentID === 0 && gr.parent.length === 0 && gr.id !== group.id))
                      .map(
                        (g, index) => (
                          <option value={g} key={index}>{ g.title }</option>
                        )
                      )
                  }
                </select>
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