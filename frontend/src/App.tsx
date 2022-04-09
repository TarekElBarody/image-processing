import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import './assets/App.css';

import AuthService from './services/auth.service';
import IUser from './types/user.type';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Error404 from './pages/Error404';
import Manager from './pages/Manager';
import EventBus from './common/EventBus';

type Props = {};

type State = {
    currentUser: IUser | undefined;
    token: string | '';
};

class App extends Component<Props, State> {
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
        //const { currentUser } = this.state;

        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login history="" />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/manager" element={<Manager />} />
                    <Route path="*" element={<Error404 />} />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;
