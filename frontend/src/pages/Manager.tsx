import AuthService from '../services/auth.service';
import Nav from '../components/navBar';
import Side from '../components/sideMenu';
import HomeService, { ImageList } from '../services/home.service';
import ImageListGrid from '../components/imageList';
import UserService from '../services/user.service';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as iconSVG from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

Swal.close();

type Props = {};

const Manager: React.FunctionComponent<Props> = (props: Props) => {
    const [loginStatus, setloginStatus] = useState({
        isLoggedIn: AuthService.getIsLoggedIn(),
        token: AuthService.getToken()
    });
    const [listUpdate, setListUpdate] = useState(false);
    const [imageList, setImageList] = useState<ImageList[]>([]);
    const [fit, setFit] = useState('cover');
    const [size, setSize] = useState(200);
    const [onSize, setOnSize] = useState(200);
    const [catchValue, setCatchValue] = useState(1);

    useEffect(() => {
        setloginStatus({
            isLoggedIn: AuthService.getIsLoggedIn(),
            token: AuthService.getToken()
        });
        document.title = `Login`;

        const check = async () => {
            await UserService.checkToken()
                .then((data) => {
                    if (data.success === true) {
                        console.log('check token success');

                        setloginStatus({
                            isLoggedIn: AuthService.getIsLoggedIn(),
                            token: AuthService.getToken()
                        });
                        updateImageList();
                    } else {
                        console.log('check token fails');
                        setloginStatus({
                            isLoggedIn: false,
                            token: ''
                        });
                    }
                })
                .catch(() => {
                    console.log('error cach check token');
                    setloginStatus({
                        isLoggedIn: false,
                        token: ''
                    });
                });
        };
        check();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loginStatus.isLoggedIn === false && loginStatus.token === '') {
        window.document.location.href = '/login';
    }

    const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOnSize(parseInt(event.target.value));
    };

    const updateFit = async (value: string) => {
        setFit(value);
        await updateImageList();
    };

    const updateCatch = async (value: string) => {
        setCatchValue(parseInt(value));
        await updateImageList();
    };

    const updateImageList = async () => {
        setImageList([]);
        setListUpdate(true);
        setSize(onSize);

        HomeService.getImagesList().then((list) => {
            setImageList(list);
            setListUpdate(false);
        });
    };

    //const { currentUser, token } = this.state;
    function handleImageClose() {
        updateImageList();
    }

    return (
        <div>
            <Nav />
            <div className="container-fluid">
                <div className="row">
                    <Side page="manager" handleImageClose={handleImageClose} />

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
                                            onChange={handleSizeChange}
                                            onMouseUp={updateImageList}
                                        />
                                    </div>

                                    <button type="button" className="btn btn-sm btn-outline-primary m-2" onClick={updateImageList}>
                                        <FontAwesomeIcon icon={iconSVG.faSync} spin={listUpdate} width={22} height={22} />
                                        refresh
                                    </button>
                                    <select className="form-select form-select-md m-2" aria-label=".form-select-md" defaultValue={fit} onChange={(e) => updateFit(e.target.value)}>
                                        <option value="cover">Crop Cover</option>
                                        <option value="fill">Crop Fill</option>
                                        <option value="contain">Crop Contain</option>
                                        <option value="inside">Crop Inside</option>
                                        <option value="outside">Crop Outside</option>
                                    </select>
                                    <select id="cache-enabled" className="form-select form-select-md m-2" aria-label=".form-select-md" defaultValue="1" onChange={(e) => updateCatch(e.target.value)}>
                                        <option value="1">Cache Enabled</option>
                                        <option value="0">Cache Disabled</option>
                                    </select>

                                    <button type="button" id="delete-btn" className="btn btn-sm btn-outline-danger m-2 disabled">
                                        <span data-feather="trash"></span>delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        <ImageListGrid imageList={imageList} size={size} fit={fit} catch={catchValue} />
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
};

export default Manager;
