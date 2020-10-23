import React from 'react'
// reactstrap components
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

export default function TableGroup (props) {
    return (
        <tr className="mt-row">
          <td>{ props.name }</td>
          <td>{ props.title }</td>
          <td>{ props.type }</td>
          <td>{ props.managers }</td>
          <td>{ props.daughter }</td>
          <td className="text-right">
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
                onClick={() => props.deleteGroup(props.group)}
              >
                Удалить
              </DropdownItem>
              <DropdownItem
                onClick={() => props.changeGroup(props.group)}
              >
                Изменить
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          </td>
        </tr>
    )
}