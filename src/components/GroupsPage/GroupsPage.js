import React from 'react';
import Navigation from '../Navigation';
import Manager from './Manager';
import EditCity from './EditCity';

class GroupsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            managers : this.props.managers,
            cities : this.props.cities,
            showEdit : false,
            editIndex : null
        }
        
        this.showEdit = this.showEdit.bind(this)
        this.editCity = this.editCity.bind(this)
        this.changeManagerStatus = this.changeManagerStatus.bind(this)
        this.removeManager = this.removeManager.bind(this)
    }

    showEdit(e) {
        this.setState({
            showEdit : !this.state.showEdit,
            editIndex : !this.state.showEdit ? parseInt(e.target.dataset.id, 10) : null
        })
    }

    editCity(e) {
        let cities = this.state.cities
        cities[this.state.editIndex] = e.target.dataset.value
        this.setState({
            cities : cities,
            showEdit : false,
            editIndex : null
        })
    }

    changeManagerStatus(e) {
        let managers = this.state.managers
        managers[parseInt(e.target.dataset.index, 10)].groups[parseInt(e.target.dataset.group, 10)] = !managers[parseInt(e.target.dataset.index, 10)].groups[parseInt(e.target.dataset.group, 10)]
        this.setState({
            managers : managers
        })
    }

    removeManager(e) {
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
                    <h2>Группы рассылок</h2>
                    { this.state.showEdit && <EditCity hide={ this.showEdit } save={ this.editCity }/> }
                    <table className="groups-table">
                        <thead>
                            <tr className="gt-row">
                                <th><h5>Менеджеры</h5></th>
                                <th>
                                    <p>{ this.state.cities[0] }</p>
                                    <button className="gt-edit" onClick={ this.showEdit } data-id="0">Изменить</button>
                                </th>
                                <th>
                                    <p>{ this.state.cities[1] }</p>
                                    <button className="gt-edit" onClick={ this.showEdit } data-id="1">Изменить</button>
                                </th>
                                <th>
                                    <p>{ this.state.cities[2] }</p>
                                    <button className="gt-edit" onClick={ this.showEdit } data-id="2">Изменить</button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.state.managers.map(
                                (manager, index) => <Manager username={ manager.username } groups={ manager.groups } key={ index } 
                                    onChange={ this.changeManagerStatus } id={ index } remove={ this.removeManager }/>
                            ) }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default GroupsPage;