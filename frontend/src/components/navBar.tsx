import { Component } from 'react';

import { Link } from 'react-router-dom';

import AuthService from '../services/auth.service';
import IUser from '../types/user.type';

import EventBus from '../common/EventBus';

type Props = {};

type State = {
    currentUser: IUser | undefined;
    token: string | '';
};

class Nav extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            currentUser: undefined,
            token: ''
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();
        const t = AuthService.getToken();

        if (user) {
            this.setState({
                currentUser: user,
                token: t
            });
        }

        EventBus.on('logout', this.logOut);
    }

    componentWillUnmount() {
        EventBus.remove('logout', this.logOut);
    }

    logOut() {
        AuthService.logout();
        this.setState({
            currentUser: undefined,
            token: ''
        });
    }

    render() {
        const { currentUser } = this.state;

        return (
            <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
                <Link className="navbar-brand col-md-3 col-lg-2 me-0 px-3" to="/">
                    <img src="/assets/img/logo.png" alt="" width="30" height="24" className="d-inline-block align-text-top mr-5" /> Image Processing API
                </Link>
                <button
                    className="navbar-toggler position-absolute d-md-none collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#sidebar-menu"
                    aria-controls="sidebar-menu"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="navbar-nav ml-auto d-flex flex-row">
                    <li className="nav-item text-nowrap">
                        <Link to={'/profile'} className="nav-link px-3 left">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                            </svg>{' '}
                            {currentUser?.first_name as string}
                        </Link>
                    </li>
                    <li className="nav-item text-nowrap">
                        <a href="/login" className="nav-link px-3" onClick={this.logOut}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                            </svg>{' '}
                            LogOut
                        </a>
                    </li>
                </div>
            </header>
            /*
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <Link to={'/'} className="navbar-brand">
                    Home
                </Link>
                <div className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to={'/home'} className="nav-link">
                            Home
                        </Link>
                    </li>

                    {currentUser && (
                        <li className="nav-item">
                            <Link to={'/user'} className="nav-link">
                                User
                            </Link>
                        </li>
                    )}
                </div>

                {currentUser ? (
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to={'/profile'} className="nav-link">
                                {currentUser.first_name}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <a href="/login" className="nav-link" onClick={this.logOut}>
                                LogOut
                            </a>
                        </li>
                    </div>
                ) : (
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to={'/login'} className="nav-link">
                                Login
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to={'/register'} className="nav-link">
                                Sign Up
                            </Link>
                        </li>
                    </div>
                )}
            </nav>
            */
        );
    }
}

export default Nav;
