import React from 'react';

class Manager extends React.Component {
    render() {
        return (
            <tr className="gt-row">
                <td className="manager">
                    <p>{ this.props.username }</p>
                    <button className="remove-manager" type="button" onClick={ this.props.remove } data-index={ this.props.id }>Удалить</button>
                </td>
                <td>
                    <input type="checkbox" defaultChecked={ this.props.groups[0] } onChange={ this.props.onChange }
                        data-index={ this.props.id } data-group="0"/>
                </td>
                <td>
                    <input type="checkbox" defaultChecked={ this.props.groups[1] } onChange={ this.props.onChange }
                        data-index={ this.props.id } data-group="1"/>
                </td>
                <td>
                    <input type="checkbox" defaultChecked={ this.props.groups[2] } onChange={ this.props.onChange } 
                        data-index={ this.props.id } data-group="2"/>
                </td>
            </tr>
        )
    }
}

export default Manager;