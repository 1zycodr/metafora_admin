import React from 'react';
import Navigation from '../Navigation';
import Manager from './Manager'

class ManagersPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            managers : this.props.managers,
        }
        
        this.deleteManager = this.deleteManager.bind(this)
    }

    deleteManager(e) { 
        let managers = this.state.managers
        delete managers[parseInt(e.target.dataset.index, 10)]
        this.setState({
            managers : managers
        })
    }

    render() {
        return (
            <div>
                <Navigation />
                <div className="page-container">
                    <h2>Менеджеры</h2>
                    <table className="managers-table">
                        <thead>
                            <tr className="mt-row">
                                <th><h5>Менеджер</h5></th>
                                <th>Имя</th>
                                <th>Фамилия</th>
                                <th>Дата</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.managers.map(
                                    (manager, index) => {
                                        return (<Manager username={ manager.username } name={ manager.name }
                                        surname={ manager.surname } date={ manager.date }
                                        deleteManager={ this.deleteManager } index={ index }
                                        status={ manager.status } key={ index }/>) 
                                    }
                                )
                                
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default ManagersPage;