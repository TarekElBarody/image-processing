import { Component } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import IUser from '../types/user.type';
import Nav from '../components/navBar';
import Side from '../components/sideMenu';
import HomeService, { ImageList } from '../services/home.service';
import ImageListGrid from '../components/imageList';
import UserService from '../services/user.service';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as iconSVG from '@fortawesome/free-solid-svg-icons';

Swal.close();

type Props = {};

type State = {
    redirect: string | null;
    userReady: boolean;
    currentUser: IUser;
    token: string;
    imageList: ImageList[];
    listUpdate: boolean;
    fit: string;
    onSize: number;
    size: number;
    catch: number;
};
export default class Manager extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.updateImageList = this.updateImageList.bind(this);
        this.handleSizeChange = this.handleSizeChange.bind(this);
        this.updateFit = this.updateFit.bind(this);
        this.updateCatch = this.updateCatch.bind(this);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {},
            token: '',
            imageList: [],
            listUpdate: false,
            fit: 'cover',
            size: 200,
            onSize: 200,
            catch: 1
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        const token = AuthService.getToken();

        if (!currentUser) this.setState({ redirect: '/login' });
        this.setState({ currentUser: currentUser, userReady: true, token: token });

        this.updateImageList();

        UserService.checkToken().then(
            (response) => {
                this.setState({
                    token: response.data.token
                });
                if (response.status === 401) {
                    AuthService.logout();
                    this.setState({
                        currentUser: {},
                        token: '',
                        redirect: '/login'
                    });
                }
            },
            (error) => {
                this.setState({
                    token: '',
                    currentUser: {},
                    redirect: '/login'
                });

                if (error.response && error.response.status === 401) {
                    AuthService.logout();
                    this.setState({
                        currentUser: {},
                        token: '',
                        redirect: '/login'
                    });
                }
            }
        );
    }

    handleSizeChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ onSize: parseInt(event.target.value) });
    }

    updateFit(value: string) {
        this.setState({ fit: value });
        this.updateImageList();
    }

    updateCatch(value: string) {
        this.setState({ catch: parseInt(value) });
        this.updateImageList();
    }

    updateImageList() {
        this.setState({ imageList: [] });
        this.setState({ listUpdate: true });
        this.setState({ size: this.state.onSize });

        HomeService.getImagesList().then((list) => {
            this.setState({
                listUpdate: false,
                imageList: list
            });
        });
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />;
        }

        const imageList = this.state.imageList;
        const fit = this.state.fit;
        const size = this.state.size;
        const onSize = this.state.onSize;
        const cached = this.state.catch;

        //const { currentUser, token } = this.state;

        return (
            <div>
                <Nav />
                <div className="container-fluid">
                    <div className="row">
                        <Side page="manager" />

                        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                                <h1 className="h2">Image Manager </h1>
                                <div className="btn-toolbar mb-2 mb-md-0">
                                    <div className="btn-group me-2">
                                        <div className="w-100  d-inline-block">
                                            {' '}
                                            <label key="image-size-label" htmlFor="image-size" className="form-label">
                                                Size {onSize}
                                            </label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="50"
                                                max="1000"
                                                step="5"
                                                key="image-size"
                                                value={onSize}
                                                onChange={this.handleSizeChange}
                                                onMouseUp={this.updateImageList}
                                            />
                                        </div>

                                        <button type="button" className="btn btn-sm btn-outline-primary m-2" onClick={this.updateImageList}>
                                            <FontAwesomeIcon icon={iconSVG.faSync} spin={this.state.listUpdate} width={22} height={22} />
                                            refresh
                                        </button>
                                        <select className="form-select form-select-md m-2" aria-label=".form-select-md" defaultValue={fit} onChange={(e) => this.updateFit(e.target.value)}>
                                            <option value="cover">Crop Cover</option>
                                            <option value="fill">Crop Fill</option>
                                            <option value="contain">Crop Contain</option>
                                            <option value="inside">Crop Inside</option>
                                            <option value="outside">Crop Outside</option>
                                        </select>
                                        <select
                                            id="cache-enabled"
                                            className="form-select form-select-md m-2"
                                            aria-label=".form-select-md"
                                            defaultValue="1"
                                            onChange={(e) => this.updateCatch(e.target.value)}
                                        >
                                            <option value="1">Cache Enabled</option>
                                            <option value="0">Cache Disabled</option>
                                        </select>

                                        <button type="button" id="delete-btn" className="btn btn-sm btn-outline-danger m-2 disabled">
                                            <span data-feather="trash"></span>delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <ImageListGrid imageList={imageList} size={size} fit={fit} catch={cached} />
                            <br />
                            <div className="border-top pt-10 mt-10"></div>
                            <br />

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
