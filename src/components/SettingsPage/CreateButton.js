import React from 'react'

const BUTTON_TYPES = {
    text: 'Текстовая',
    file: 'Файловая'
}

class CreateButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text : '',
            type : BUTTON_TYPES.text
        }
        
        this.handleTextChange = this.handleTextChange.bind(this)
        this.handleTypeChange = this.handleTypeChange.bind(this)
    }

    handleTextChange(e) {
        this.setState({ text : e.target.value })
    }

    handleTypeChange(e) {
        this.setState({ type: e.target.value })
    }

    render() {
        return (
            <div className="replica-create-button">
                <div className="rcb-container">
                    <div className="rcb-text">
                        <p>Текст:</p>
                        <input type="text" onChange={ this.handleTextChange }/>
                    </div>
                    <div className="rcb-type">
                        <p>Тип:</p>
                        <select defaultValue={ this.state.type } onChange={ this.handleTypeChange }>
                            <option defaultValue={ BUTTON_TYPES.text }>Текстовая</option>
                            <option defaultValue={ BUTTON_TYPES.file}>Файловая</option>
                        </select>
                    </div>
                    <button className="rcb-hide" type="button" onClick={ this.props.hide }>Отмена</button>
                    <button className="rcb-create" type="button" data-text={ this.state.text } 
                    data-type={ this.state.type } onClick={ this.props.addButton }>Создать</button>
                </div>
            </div>
        )
    }
}

export default CreateButton;