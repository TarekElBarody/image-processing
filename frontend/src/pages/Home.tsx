import Nav from '../components/navBar';
import Side from '../components/sideMenu';
import HomeService, { ImagesCount, ImageHistory } from '../services/home.service';
import CountFullCard from '../components/countFullCard';
import CountThumbCard from '../components/countThumbCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as iconSVG from '@fortawesome/free-solid-svg-icons';
import HomeTable from '../components/homeTable';

import AuthService from '../services/auth.service';
import UserService from '../services/user.service';

import { useEffect, useState } from 'react';

type Props = {};

const Home: React.FunctionComponent<Props> = (props: Props) => {
    const [loginStatus, setloginStatus] = useState({
        isLoggedIn: AuthService.getIsLoggedIn(),
        token: AuthService.getToken()
    });
    const [imageCount, setImageCount] = useState<ImagesCount>({
        fullCount: 0,
        thumbCount: 0
    });
    const [dashboardUpdate, setDashboardUpdate] = useState(false);
    const [imageHistory, setImageHistory] = useState<ImageHistory[]>([]);
    const [HistoryUpdate, setHistoryUpdate] = useState(false);
    const [deurations, setDeurations] = useState(0);
    const [reportCount, setReportCount] = useState(0);

    useEffect(() => {
        setloginStatus({
            isLoggedIn: AuthService.getIsLoggedIn(),
            token: AuthService.getToken()
        });
        document.title = `Login`;

        const check = async () => {
            await UserService.checkToken()
                .then((data) => {
                    updateCounts();
                    updateHistory();
                    if (data.success === true) {
                        console.log('check token success');

                        setloginStatus({
                            isLoggedIn: AuthService.getIsLoggedIn(),
                            token: AuthService.getToken()
                        });
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

    async function updateCounts() {
        setDashboardUpdate(true);
        await HomeService.getImagesCount().then((imageRes) => {
            setDashboardUpdate(false);
            setImageCount({
                fullCount: imageRes.fullCount,
                thumbCount: imageRes.thumbCount
            });
        });
    }

    async function updateHistory() {
        setHistoryUpdate(true);
        await HomeService.getImagesHistory().then(async (history: ImageHistory[]) => {
            setHistoryUpdate(false);
            setImageHistory(history as ImageHistory[]);
            const images = history;
            let sum = 0;
            for (let i = 0; i < images.length - 1; i++) {
                const t = images[i] as ImageHistory;
                const b = t.duration as string;
                const a = parseInt(b);
                sum += a;
            }
            setDeurations(parseInt((sum / 1000).toFixed(0)));
            const mm = images.length > 0 ? Number((images.length / 1000).toFixed(3)) : 0;
            setReportCount(mm);
        });
    }

    function handleImageClose() {
        updateCounts();
        updateHistory();
    }

    return (
        <div>
            <Nav />
            <div className="container-fluid">
                <div className="row">
                    <Side page="home" handleImageClose={handleImageClose} />

                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h1 className="h2">
                                Dashboard{' '}
                                <a className="btn-link" onClick={updateCounts} href="#/updateCounts">
                                    <FontAwesomeIcon key="dashboardUpdate" icon={iconSVG.faSync} spin={dashboardUpdate} width={22} height={22} />
                                </a>
                            </h1>
                        </div>

                        <div className="row">
                            <div className="col-sm-6 d-flex">
                                <CountFullCard count={imageCount.fullCount} />
                                <CountThumbCard count={imageCount.thumbCount} />

                                <div className="card text-white bg-secondary  m-3 min-width-300">
                                    <div className="card-header">Processing Time for last 10k</div>
                                    <div className="card-body">
                                        <h5 className="card-title" id="processing-time">
                                            {deurations} seconds / {reportCount}k
                                        </h5>
                                        <br />
                                        <button type="button" onClick={updateHistory} className="btn btn-info" id="reload-activity">
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
                            <a className="btn-link" onClick={updateHistory} href="#/updateCounts">
                                <FontAwesomeIcon key="HistoryUpdate" icon={iconSVG.faSync} spin={HistoryUpdate} width={22} height={22} />
                            </a>
                        </h2>
                        <div>
                            <HomeTable imageHistory={imageHistory} />
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
};

export default Home;
