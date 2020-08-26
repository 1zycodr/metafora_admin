import React from 'react'

export default function Manager (props) {
    return (
        <tr className="mt-row">
            <td className="manager">
                <p>{ props.username }</p>
                <button className="remove-manager" onClick={ props.deleteManager } data-index={ props.index }>Удалить</button>
            </td>
            <td>{ props.name }</td>
            <td>{ props.surname }</td>
            <td>{ props.date }</td>
            <td>{ props.status }</td>
        </tr>
    )
}