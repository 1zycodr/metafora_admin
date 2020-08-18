import React from 'react';
import Navigation from '../Navigation';

class MessagesPage extends React.Component {
    render() {
        return (
            <div className="messages">
                <Navigation />
                <h1>Сообщения</h1>
            </div>
        )
    }
}

export default MessagesPage;