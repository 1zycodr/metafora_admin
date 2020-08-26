import React from 'react'

export default function Chat(props) {
    return (
        <div className="chat-background">
            <div className="chat">
                <h2>{ props.title }</h2>
                <div className="chat-container">
                    { props.messages.map(
                        (message, index) => {
                            return ( <div className="cc-message" key={ index }>
                                <p>{ '> ' + message.message + (message.type === "button" || message.type === "select" ? ` (${message.dataType})` : '')}</p>
                                <span>{ message.date }</span>
                            </div> )
                        }
                    ) }
                </div>
                <button className="chat-close" onClick={ props.back}>Назад</button>
            </div>
        </div>
    )
}