import React from 'react';
import {
    Card,
    CardHeader,
    Container,
    Row,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from 'reactstrap';
import Header from 'components/Headers/Header.js';
import Message from 'components/MessagesPage/Message';
import Chat from './Chat';

import { ajax } from 'rxjs/ajax';
import { switchMap, map } from 'rxjs/operators';
import { request, getToken } from 'config';

const rooms = [];
class MessagesPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rooms : rooms,
      showModal : false,
      modalChat : null,
      modal: {
        open: false,
        title: 'Удаление менеджера',
        body: room => <Chat room={room}/>,
        ok: this.toggle.bind(this),
        okTitle: 'Да',
        cancel: this.toggle.bind(this),
        cancelTitle: 'Отмена',
      },
    }

    this.deleteRoom = this.deleteRoom.bind(this)
    this.changeRoomStatus = this.changeRoomStatus.bind(this)
    this.showModal = this.showModal.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  componentWillMount() {
    this.queryRooms()
  }

  queryRooms() {
    ajax({
      url: request(`room`),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': getToken(),
      }
    }).pipe(
      switchMap(res => res.response.data),
    ).subscribe(
      rooms => this.setState({rooms: [...this.state.rooms, rooms ]}), 
      err => {console.log(err); this.setState({ rooms })}
    )
  }
  deleteRoom(e) {
      let { rooms } = this.state
      rooms.splice(parseInt(e.target.dataset.index, 10), 1)
      this.setState({ rooms })
  }
  success(res, room) {
    if(res.response.success){
      const rooms = this.state.rooms.map(r => {
        if(r.chatRoom === room.chatRoom){
          return room;
        } 
        return r;
      })
      this.setState({ rooms, modal: {...this.state.modal, open: !this.state.modal.open} });
    }
  }
  changeRoomStatus(room) {
    const yes = () => {
      room.status = room.status ? 0 : 1;
      ajax({
        url: request(`room/update`),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': getToken(),
        },
        body: room
      }).pipe(
        map(res => this.success(res, room))
      ).subscribe()
    }
    this.setState({
      modal: {
        open: true,
        title: 'Список сообщений',
        body: <div>Вы действительно хотите <b className="text-warning">{room.status ? 'закрыть' : 'открыть'}</b> чат?</div>,
        ok: yes.bind(this),
        okTitle: 'Да',
        cancel: this.toggle.bind(this),
        cancelTitle: 'Нет',
      }
    })
  }
  toggle() {
    this.setState({ modal: {...this.state.modal, open: !this.state.modal.open} })
  }
  showModal(room) {
    this.setState({
      modal: {
        open: true,
        title: 'Список сообщений',
        body: <Chat room={room}/>,
        ok: this.toggle.bind(this),
        okTitle: 'Закрыть',
        cancel: this.toggle.bind(this),
        cancelTitle: 'Отмена',
      }
    })
  }

  render() {
    const { modal } = this.state;
    return (
      <>
        <Modal isOpen={modal.open} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{modal.title}</ModalHeader>
          <ModalBody>{typeof modal.body === 'function' ? modal.body() : modal.body }</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={modal.ok}>{modal.okTitle}</Button>
          </ModalFooter>
        </Modal>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
        <Row>
          <div className="col">
          <Card className="shadow">
            <CardHeader className="border-0">
            <h2>Список чатов</h2>
            </CardHeader>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr className="mt-row">
                  <th>Номер чата</th>
                  <th>Группа менеджеров</th>
                  <th>Токен чата</th>
                  <th>Режим клиента</th>
                  <th>Статус</th>
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                { this.state.rooms.map(
                  (room, index) => {
                    return <Message key={ index } index={ index } room={room} 
                      showMessage={ this.showModal } changeRoomStatus={ this.changeRoomStatus } deleteRoom={ this.deleteRoom } />
                  }
                )}
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

export default MessagesPage;