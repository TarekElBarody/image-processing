import { Component } from 'react';
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

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />;
        }

        const { currentUser, token } = this.state;

        return (
            <div className="container">
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
            </div>
        );
    }
}
