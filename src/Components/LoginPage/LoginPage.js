import React from 'react';

class LoginPage extends React.Component {
    render() {
        return (
            <div className="login-page">
                <form action="">
                    <div className="container">
                        <label htmlFor="uname"><b>Username</b></label>
                        <input className="username" type="text" placeholder="Enter Username" name="uname" required/>
                        <label htmlFor="psw"><b>Password</b></label>
                        <input className="password" type="password" placeholder="Enter Password" name="psw" required/>
                        <button className="login" type="submit">Login</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default LoginPage;