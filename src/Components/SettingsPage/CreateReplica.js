import React from 'react';
import ReplicaButton from './ReplicaButton';
import CreateButton from './CreateButton';

const REPLICAS_TYPES = {
    without_buttons: 'Без кнопок',
    with_buttons: 'С кнопками',
}

class CreateReplica extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text : '',
            type : REPLICAS_TYPES.without_buttons,
            buttons : [],
            showCreateButton : false
        }

        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleTypeChange = this.handleTypeChange.bind(this)
        this.showCreateButton = this.showCreateButton.bind(this)
        this.addButton = this.addButton.bind(this)
        this.removeButton = this.removeButton.bind(this)
    }

    handleTextChange(e) {
        this.setState({
            text : e.target.value
        })
    }

    handleTypeChange(e) {
        this.setState({
            type : e.target.value, 
            buttons : []
        })
    }

    showCreateButton() {
        this.setState({ showCreateButton : !this.state.showCreateButton })
    }
    
    addButton(e) {
        let buttons = this.state.buttons
        buttons.push({
            text : e.target.dataset.text,
            type : e.target.dataset.type
        }) 
        this.setState({ 
            showCreateButton : !this.state.showCreateButton,
            buttons : buttons
        })
    }

    removeButton(e) {
        let buttons = this.state.buttons
        console.log(parseInt(e.target.dataset.id, 10))
        buttons.splice(parseInt(e.target.dataset.id, 10), 1)
        this.setState({ buttons : buttons })
    }

    render() {
        return (
            <div className="replica-create">
                <div className="replica-create-container">
                    <div className="rc-text">
                        <p>Текст:</p>
                        <input onChange={ this.handleTextChange } type="text"/>
                    </div>
                    <div className="rc-type">
                        <p>Тип:</p>
                        <select value={ this.state.type } className="rc-type-sel" onChange={ this.handleTypeChange }>
                            <option value={ REPLICAS_TYPES.with_buttons }>С кнопками</option>
                            <option value={ REPLICAS_TYPES.without_buttons }>Без кнопок</option>
                        </select>
                    </div>
                    { this.state.type === REPLICAS_TYPES.with_buttons && 
                        <div className="rc-buttons">
                            <p>Кнопки: </p>
                            <div className="rc-buttons-list">
                                { this.state.buttons.map(
                                    (button, index) => 
                                        <ReplicaButton text={ button.text } type={ button.type } key={ index } id={ index } remove={ this.removeButton }/>
                                ) }
                            </div>
                            <button className="rc-buttons-add" type="button" onClick={ this.showCreateButton }>Создать кнопку</button>
                            { this.state.showCreateButton && <CreateButton hide={ this.showCreateButton } addButton={ this.addButton }/> }
                        </div> }
                    <button className="replica-create-hide" type="button" onClick={ this.props.hide }>Отмена</button>  
                    <button className="replica-create-but" type="button" onClick={ this.props.addReplica }
                        data-text={ this.state.text } data-type={ this.state.type } data-buttons={ JSON.stringify(this.state.buttons) }>Создать</button> 
                </div>     
            </div>
        )
    }
}

export default CreateReplica;