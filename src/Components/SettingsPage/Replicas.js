import React from 'react';
import Replica from './Replica';
import CreateReplica from './CreateReplica';

const REPLICAS_TYPES = {
    without_buttons: 'Без кнопок',
    with_buttons: 'С кнопками',
}

class Replicas extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            replicas : props.replicas,
            showModal : false
        }
        this.addReplica = this.addReplica.bind(this)
        this.removeReplica = this.removeReplica.bind(this)
        this.showModal = this.showModal.bind(this)
    }

    addReplica(data) {
        let replicas = this.state.replicas

        if (data.target.dataset.type === REPLICAS_TYPES.without_buttons) {
            replicas.push({
                text : data.target.dataset.text,
                type : data.target.dataset.type
            })
        } else {
            replicas.push({
                text : data.target.dataset.text,
                type : data.target.dataset.type,
                buttons : JSON.parse(data.target.dataset.buttons)
            })
        }
        
        this.setState({ 
            showModal : !this.state.showModal,
            replicas : replicas
        })
    }
    
    showModal() {
        this.setState({ showModal : !this.state.showModal })
    }

    removeReplica(event) {
        let replicas = this.state.replicas
        replicas.splice(parseInt(event.target.dataset.id), 1)
        this.setState({
            replicas : replicas
        })
    }
    
    render() {
        const { replicas } = this.state
        return (
            <div className="replicas">
                { replicas.map(
                    (replica, index) => <Replica data={ replica } key={ index } remove={ this.removeReplica } id={ index }/>
                ) }
                <button className="replicas-create" onClick={ this.showModal } type="button">Создать реплику</button>
                { this.state.showModal && <CreateReplica hide={ this.showModal } addReplica={ this.addReplica }/>}
            </div>
        )
    }edsz
}

export default Replicas;