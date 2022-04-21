import { Component } from 'react';
import Nav from '../components/navBar';
import Side from '../components/sideMenu';

import { Navigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import IUser from '../types/user.type';

type Props = {};

type State = {
    redirect: string | null;
    userReady: boolean;
    currentUser: IUser;
    token: string;
};
export default class Profile extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleImageClose = this.handleImageClose.bind(this);
        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {},
            token: ''
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        const token = AuthService.getToken();

        if (!currentUser) this.setState({ redirect: '/login' });
        this.setState({ currentUser: currentUser, userReady: true, token: token });
    }

    handleImageClose() {}

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />;
        }

        const { currentUser, token } = this.state;

        return (
            <div>
                <Nav />
                <div className="container-fluid">
                    <div className="row">
                        <Side page="home" handleImageClose={this.handleImageClose} />
                        <p></p>
                        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-20 mr-20">
                            {this.state.userReady ? (
                                <div>
                                    <header className="jumbotron">
                                        <h3>
                                            <strong>
                                                {currentUser.first_name} {currentUser.last_name}{' '}
                                            </strong>{' '}
                                            Profile
                                        </h3>
                                    </header>
                                    <p>
                                        <strong>Token:</strong> {token.substring(0, 20)} ... {token.substr(token.length - 20)}
                                    </p>
                                    <p>
                                        <strong>Id:</strong> {currentUser.id}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {currentUser.email}
                                    </p>
                                    <strong>Authorities:</strong>
                                    <ul>{currentUser.role}</ul>
                                </div>
                            ) : null}
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}
