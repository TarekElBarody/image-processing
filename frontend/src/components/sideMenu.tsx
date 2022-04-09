import { Component } from 'react';

import AuthService from '../services/auth.service';
import IUser from '../types/user.type';

import EventBus from '../common/EventBus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserLock } from '@fortawesome/free-solid-svg-icons';
import UploadImage from './uploadImage';

type Props = {
    page: string;
};

type State = {
    currentUser: IUser | undefined;
    token: string | '';
    uploadShow: boolean;
};

class Side extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.logOut = this.logOut.bind(this);
        this.HandelUpload = this.HandelUpload.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            currentUser: undefined,
            token: '',
            uploadShow: false
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

    HandelUpload() {
        this.setState({
            uploadShow: true
        });
    }

    handleClose(val: boolean) {
        this.setState({
            uploadShow: val
        });
    }

    render() {
        //const { currentUser } = this.state;
        const homeClass = this.props.page === 'home' ? 'nav-link active' : 'nav-link';
        const managerClass = this.props.page === 'manager' ? 'nav-link active' : 'nav-link';

        return (
            <>
                <nav id="sidebar-menu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                    <div className="position-sticky pt-3">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <a className={homeClass} aria-current="page" href="/">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16">
                                        <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z" />
                                    </svg>{' '}
                                    Dashboard
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={managerClass} href="/manager">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-images" viewBox="0 0 16 16">
                                        <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                                        <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z" />
                                    </svg>{' '}
                                    Image Manager
                                </a>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link" id="upload-image" onClick={this.HandelUpload}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cloud-upload-fill" viewBox="0 0 16 16">
                                        <path
                                            fillRule="evenodd"
                                            d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.5 14.5V11h1v3.5a.5.5 0 0 1-1 0z"
                                        />
                                    </svg>{' '}
                                    Upload Image
                                </button>
                            </li>
                        </ul>

                        <h4 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                            <span>Security Tools</span>
                            <span data-feather="settings"></span>
                        </h4>
                        <ul className="nav flex-column mb-2">
                            <li className="nav-item">
                                <a className="nav-link" id="add-new-user" href="#/">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-plus-fill" viewBox="0 0 16 16">
                                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                        <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                                    </svg>{' '}
                                    Add new user
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="manage-users" href="#/">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                        <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z" />
                                        <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                                    </svg>{' '}
                                    Manage Users
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="change-password" href="#/">
                                    <FontAwesomeIcon icon={faUserLock} /> Change Password
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/login" onClick={this.logOut}>
                                    <span data-feather="lock"></span>
                                    Sign Out
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <UploadImage show={this.state.uploadShow} handleClose={this.handleClose} />
            </>
        );
    }
}

export default Side;
