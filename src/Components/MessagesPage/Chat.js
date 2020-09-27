import React from 'react'

export default function Chat(props) {
    return (
        <div className="chat-background">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{ props.title }</h5>
                        <button type="button" className="close" onClick={ props.back } data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body" >
                        { props.messages.map(
                            (message, index) => {
                                return ( <div className="cc-message" key={ index }>
                                    <p>{ '> ' + message.message + (message.type === "button" || message.type === "select" ? ` (${message.dataType})` : '')}</p>
                                    <span>{ message.date }</span>
                                </div> )
                            }
                        ) }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={ props.back }>Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}