import React from 'react';
import Navigation from '../Navigation';

class MessagesPage extends React.Component {
    render() {
        return (
            <div>
                <Navigation />
                <div className="page-container">
                    <h2>Сообщения</h2>
                </div>
            </div>
        )
    }
}

export default MessagesPage;