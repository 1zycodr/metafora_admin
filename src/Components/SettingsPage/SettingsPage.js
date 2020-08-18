import React from 'react';
import Navigation from '../Navigation';

function SettingsPage (props) {
    return (
        <div>
            <Navigation />
            <div className="page-container">
                <h2>Настройки</h2>
                <form action="post" noValidate="novalidate">
                    <table className="form-table" role="presentation">
                        <tbody>
                            <tr>
                                <th scope="row"><label htmlFor="token">Токен телеграмм бота</label></th>
                                <td><input name="token" type="text" id="token" defaultValue={ props.token } className="regular-text"/></td>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="durationStart">Время начальной реплики бота</label></th>
                                <td><input name="durationStart" type="text" id="durationStart" defaultValue={ props.durationStart } className="regular-text"/></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    )
}

export default SettingsPage;