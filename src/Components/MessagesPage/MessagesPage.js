import React from 'react';
import Navigation from '../Navigation';

class MessagesPage extends React.Component {
    render() {
        return (
            <div>
                <Navigation />
                <div className="page-container">
                    <h2>Сообщения</h2>
                    <table className="messages-table">
                        <thead>
                            <tr className="mt-row">
                                <th><h5>Сообщения</h5></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default MessagesPage;