import React from 'react';

class EditCity extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            val : ''
        }

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        this.setState({
            val : e.target.value
        })
    }

    render() {
        return (
            <div className="edit-city">
                <div className="edit-city-container">
                    <p className="edit-city-title">Введите новое название: </p>
                    <input type="text" className="edit-city-val" onChange={ this.handleChange }/>
                    <button className="edit-city-cancel" onClick={ this.props.hide }>Отменить</button>
                    <button className="edit-city-save" onClick={ this.props.save } data-value={ this.state.val } >Сохранить</button>
                </div>
            </div>
        )
    }
}

export default EditCity;