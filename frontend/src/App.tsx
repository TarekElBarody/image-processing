import { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import './assets/App.css';

import AuthService from './services/auth.service';
import UserService from './services/user.service';

import IUser from './types/user.type';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Error404 from './pages/Error404';
import Manager from './pages/Manager';

type Props = {};

type State = {
    isLoggedIn: boolean;
    userReady: boolean;
    currentUser: IUser | undefined;
    token: string;
};

class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isLoggedIn: false,
            userReady: false,
            currentUser: undefined,
            token: ''
        };
    }

    async UNSAFE_componentWillMount() {
        const currentUser = AuthService.getCurrentUser();
        const token = AuthService.getToken();
        const logged = Boolean(AuthService.getIsLoggedIn());
        this.setState({ isLoggedIn: logged, currentUser: currentUser, userReady: true, token: token });

        UserService.checkToken().then((data) => {
            this.setState({
                token: data.token
            });
            if (data.success === false) {
                AuthService.logout();
                this.setState({
                    currentUser: {},
                    token: ''
                });
                this.setState({ isLoggedIn: false });
                window.location.href = '/login';
            } else {
                this.setState({ isLoggedIn: true, currentUser: currentUser, userReady: true, token: token });
            }
        });
    }

    async componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        const token = AuthService.getToken();
        const logged = Boolean(AuthService.getIsLoggedIn());
        this.setState({ isLoggedIn: logged, currentUser: currentUser, userReady: true, token: token });

        UserService.checkToken().then((data) => {
            this.setState({
                token: data.token
            });
            if (data.success === false) {
                AuthService.logout();
                this.setState({
                    currentUser: {},
                    token: ''
                });
                this.setState({ isLoggedIn: false });
                window.location.href = '/login';
            } else {
                this.setState({ isLoggedIn: true, currentUser: currentUser, userReady: true, token: token });
            }
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
