import React from 'react';
import Navigation from '../Navigation';

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
                                <th scope="row"><label htmlFor="token">Токен телеграмм бота</label></th>
                                <td><input name="token" type="text" id="token" defaultValue={ props.token } className="regular-text"/></td>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="durationStart">Таймер ответа бота на сообщение (секунды)</label></th>
                                <td><input name="durationStart" type="text" id="durationStart" defaultValue={ props.answTime } className="regular-text"/></td>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="durationStart">Время начальной реплики бота</label></th>
                                <td><input name="durationStart" type="text" id="durationStart" defaultValue={ props.durationStart } className="regular-text"/></td>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="durationStart">Идентификатор папки в Google Drive</label></th>
                                <td><input name="durationStart" type="text" id="durationStart" defaultValue={ props.folderId } className="regular-text"/></td>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="durationStart">Ключ авторизации сервисного аккаунта Google Drive</label></th>
                                <textarea className="regular-text" rows="20" cols="50" name="credentials" type="text" id="credentials">
                                    { props.authKey }
                                </textarea>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="durationStart">Интервал ответа от группы рассылок (если не отвечено)</label></th>
                                <td><input name="durationStart" type="text" id="durationStart" defaultValue={ props.groupAnswInterval } className="regular-text"/></td>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="durationStart">Интервал ответа от менеджера</label></th>
                                <td><input name="durationStart" type="text" id="durationStart" defaultValue={ props.managerAnswInterval } className="regular-text"/></td>
                            </tr>
                            <tr>
                                <th scope="row"><label htmlFor="durationStart">Почта администратора</label></th>
                                <td><input name="durationStart" type="text" id="durationStart" defaultValue={ props.adminEmail } className="regular-text"/></td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="submit">
                        <input type="submit" name="submit" id="submit" class="button button-primary" value="Сохранить"/>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SettingsPage;