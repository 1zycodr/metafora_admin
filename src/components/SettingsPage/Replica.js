import React from 'react';

// class Replica extends React.Component {
//     render() {
//         return <div className="replica">{ this.props.data.text }</div>
//     }
// }

const REPLICAS_TYPES = {
    without_buttons: 'Без кнопок',
    with_buttons: 'С кнопками',
}

function Replica (props) {
    const replica = props.data;
    return(
        <div className="replica">
            <div className="replica-text">
                <p className="replica-text-title">Текст:</p>
                <p className="replica-text-content">{ replica.text }</p>
            </div>
            <div className="replica-type">
                <p className="replica-type-title">Тип:</p>
                <p className="replica-type-text">{ replica.type }</p>
            </div>
            { replica.type === REPLICAS_TYPES.with_buttons ? 
                <div className="replica-buttons">
                    <div className="replica-buttons-title">
                        <p className="rbt-head">Кнопки:</p>
                    </div>
                    { replica.buttons.map(
                        (button, index) => {
                            return  <div className="replica-buttons-button" key={ index }>{ button.text }</div>
                        }
                    ) }
                </div>     
            : null }
            <div className="replica-remove">
                <button onClick={ props.remove } data-id={ props.id } type="button">Удалить</button>
            </div>
        </div>
    )
}
export default Replica;