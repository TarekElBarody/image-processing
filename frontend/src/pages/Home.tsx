import { Component } from 'react';
import AuthService from '../services/auth.service';
import IUser from '../types/user.type';
import Nav from '../components/navBar';
import Side from '../components/sideMenu';
import HomeService, { ImagesCount, ImageHistory } from '../services/home.service';
import CountFullCard from '../components/countFullCard';
import CountThumbCard from '../components/countThumbCard';
import UserService from '../services/user.service';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as iconSVG from '@fortawesome/free-solid-svg-icons';
import HomeTable from '../components/homeTable';

Swal.close();

type Props = {};

type State = {
    isLoggedIn: boolean;
    userReady: boolean;
    currentUser: IUser;
    token: string;
    imageCount: ImagesCount;
    dashboardUpdate: boolean;
    HistoryUpdate: boolean;
    imageHistory: ImageHistory[];
};
export default class Home extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.updateCounts = this.updateCounts.bind(this);
        this.updateHistory = this.updateHistory.bind(this);

        this.state = {
            isLoggedIn: false,
            userReady: false,
            currentUser: {},
            token: '',
            imageCount: {
                fullCount: 0,
                thumbCount: 0
            },
            dashboardUpdate: false,
            HistoryUpdate: false,
            imageHistory: []
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

        this.updateCounts();

        this.updateHistory();
    }

    updateCounts() {
        this.setState({ dashboardUpdate: true });

        HomeService.getImagesCount().then((imageRes) => {
            this.setState({
                dashboardUpdate: false,
                imageCount: {
                    fullCount: imageRes.fullCount,
                    thumbCount: imageRes.thumbCount
                }
            });
        });
    }

    updateHistory() {
        this.setState({ HistoryUpdate: true });

        HomeService.getImagesHistory().then((history) => {
            this.setState({
                HistoryUpdate: false,
                imageHistory: history
            });
        });
    }

    render() {
        if (this.state.isLoggedIn === false) {
            window.location.href = '/login';
        }
        //const elements = this.state.imageHistory;
        const thumbCount = this.state.imageCount.thumbCount;
        const fullCount = this.state.imageCount.fullCount;

        //const { currentUser, token } = this.state;

        return (
            <div>
                <Nav />
                <div className="container-fluid">
                    <div className="row">
                        <Side page="home" />

                        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                                <h1 className="h2">
                                    Dashboard{' '}
                                    <a className="btn-link" onClick={this.updateCounts} href="#/updateCounts">
                                        <FontAwesomeIcon icon={iconSVG.faSync} spin={this.state.dashboardUpdate} width={22} height={22} />
                                    </a>
                                </h1>
                            </div>

                            <div className="row">
                                <div className="col-sm-6 d-flex">
                                    <CountFullCard count={fullCount} />
                                    <CountThumbCard count={thumbCount} />

                                    <div className="card text-white bg-secondary  m-3 min-width-300">
                                        <div className="card-header">Processing Time for last 10k</div>
                                        <div className="card-body">
                                            <h5 className="card-title" id="processing-time">
                                                0 seconds / 10k
                                            </h5>
                                            <br />
                                            <button type="button" className="btn btn-info" id="reload-activity">
                                                Reload Activity History
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className="border-top pt-10 mt-10"></div>
                            <br />

                            <h2>
                                Last 10k Processing Activity <span id="stress-sp"></span>
                            </h2>
                            <div>
                                <HomeTable imageHistory={this.state.imageHistory} />
                            </div>
                            <p></p>
                            <p className="mt-5 mb-3 text-muted">
                                <a href="https://github.com/TarekElBarody">Tarek El-Barody</a> &copy; 2022
                            </p>
                            <p></p>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}
