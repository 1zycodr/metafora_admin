import React from 'react';
import messages_logo from '../img/messages_logo.png';
import managers_logo from '../img/managers_logo.png';
import groups_logo from '../img/groups_logo.png';
import settings_logo from '../img/settings_logo.png';

export default function Navigation (props) {
    return (
        <div className="sidebar">
            <div className="sidebar-inner">
                <ul className="sidebar-menu ps pos-r">
                    <li className="nav-item">
                        <a className="sidebar-link" href="./messages" default>
                            <span className="sidebar-logo">
                                <img alt="" src={ messages_logo }/>
                            </span>
                            <span className="title">Сообщения</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="sidebar-link" href="./managers" default>
                            <span className="sidebar-logo">
                                <img alt="" src={ managers_logo }/>
                            </span>
                            <span className="title">Менеджеры</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="sidebar-link" href="./groups" default>
                            <span className="sidebar-logo">
                                <img alt="" src={ groups_logo }/>
                            </span>
                            <span className="title">Группы рассылок</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="sidebar-link" href="./settings" default>
                            <span className="sidebar-logo">
                                <img alt="" src={ settings_logo }/>
                            </span>
                            <span className="title">Настройки</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}
