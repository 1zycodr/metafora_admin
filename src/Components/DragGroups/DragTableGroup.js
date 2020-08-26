import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
} from "reactstrap";

class DragTableGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groups: this.props.groups,
    }
    this.onDragEnd = this.onDragEnd.bind(this);
    this.getList = this.getList.bind(this);
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
  onDragEnd(result) {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      this.exitGroup(source)
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
      console.log('groups', groups)
      // this.setState({ groups });
    }
  }
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
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