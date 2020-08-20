import React from 'react';
import Navigation from '../Navigation';
import Replicas from './Replicas';

function SettingsPage (props) {
    return (
        <div>
            <Navigation />
            <div className="page-container">
                <h2>Настройки</h2>
                <form action="" noValidate="novalidate">
                    <table className="form-table" role="presentation">
                        <tbody>
                            <tr>
                                <th scope="row"><label htmlFor="replicas">Реплики бота</label></th>
                                <td><Replicas replicas={ props.replicas } /></td>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="token">Токен телеграмм бота</label></th>
                                <td><input name="token" type="text" id="token" defaultValue={ props.token } className="regular-text"/></td>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="answTime">Таймер ответа бота на сообщение (секунды)</label></th>
                                <td><input name="answTime" type="text" id="answTime" defaultValue={ props.answTime } className="regular-text"/></td>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="durationStart">Время начальной реплики бота</label></th>
                                <td><input name="durationStart" type="text" id="durationStart" defaultValue={ props.durationStart } className="regular-text"/></td>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="folderId">Идентификатор папки в Google Drive</label></th>
                                <td><input name="folderId" type="text" id="folderId" defaultValue={ props.folderId } className="regular-text"/></td>
                            </tr>
                            <tr>
                                <th scope="row"><label>Ключ авторизации сервисного аккаунта Google Drive</label></th>
                                <td><textarea className="regular-text" rows="20" cols="50" name="credentials" type="text" id="credentials" defaultValue={ props.authKey }/></td>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="groupAnswInterval">Интервал ответа от группы рассылок (если не отвечено)</label></th>
                                <td><input name="groupAnswInterval" type="text" id="groupAnswInterval" defaultValue={ props.groupAnswInterval } className="regular-text"/></td>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="managerAnswInterval">Интервал ответа от менеджера</label></th>
                                <td><input name="managerAnswInterval" type="text" id="managerAnswInterval" defaultValue={ props.managerAnswInterval } className="regular-text"/></td>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="adminEmail">Почта администратора</label></th>
                                <td><input name="adminEmail" type="text" id="adminEmail" defaultValue={ props.adminEmail } className="regular-text"/></td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="submit">
                        <input type="submit" name="submit" id="submit" className="button button-primary" value="Сохранить"/>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SettingsPage;