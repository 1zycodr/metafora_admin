import React from 'react'
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";

const statuses = ['Закрыта', 'Открыта', 'Занята', 'Покинута'];

function Message(props) {
  const { room, showMessage, changeRoomStatus, index } = props;
  return (
    <tr key={index}>
      <td>{ room.id }</td>
      <td>{ room.groupTitle }</td>
      <td>{ room.chatRoom }</td>
      <td>{ room.mute ? 'В муте' : 'Принимает сообщения' }</td>
      <td>{ statuses[room.status] }</td>          
      <td className="text-right">
        <UncontrolledDropdown>
          <DropdownToggle
            className="btn-icon-only text-light"
            href="pablo"
            role="button"
            size="sm"
            color=""
            onClick={e => e.preventDefault()}
          >
            <i className="fas fa-ellipsis-v" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-arrow" right>
            <DropdownItem
              onClick={() => showMessage(room)}
            >
              Просмотр сообщений
            </DropdownItem>
            <DropdownItem
              onClick={() => changeRoomStatus(room)}
            >
              {room.status === 0 ? 'Открыть' : 'Закрыть'}
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </td>
    </tr>
  )
}

export default Message;