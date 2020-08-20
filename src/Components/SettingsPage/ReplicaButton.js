import React from 'react';

class ReplicaButton extends React.Component {
    render() {
        return (
            <div className="replica-button">
                <div className="rb-text">
                    <p className="rb-text-title">Текст:</p>
                    <p className="rb-text-content">{ this.props.text }</p>
                </div>
                <div className="rb-type">
                    <p className="rb-type-title">Тип:</p>
                    <p className="rb-type-content">{ this.props.type }</p>
                </div>
                <button onClick={ this.props.remove } type="button" data-id={ this.props.id }>Удалить</button>
            </div>
        )
    }
}

export default ReplicaButton;