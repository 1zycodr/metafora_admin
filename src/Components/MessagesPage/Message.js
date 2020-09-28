import React from 'react'

export default function Message (props) {
    return (
        <tr className="message">
            <td>
                <p>{ props.id }</p>
                <button onClick={ props.checkChat } data-index={ props.index } data-id={ props.id }>Посмотреть</button>
                <button onClick={ props.deleteRoom } data-index={ props.index }>Удалить</button>
            </td>
            <td>{ props.group }</td>
            <td>{ props.token }</td>
            <td>{ props.status ? "Активен" : "Неактивен" }</td>
        </tr>
    )
} 