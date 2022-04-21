import Nav from '../components/navBar';
import Side from '../components/sideMenu';

import Register from '../components/Register';

import AuthService from '../services/auth.service';
import UserService from '../services/user.service';

import { useEffect, useState } from 'react';

type Props = {};

const RegisterPage: React.FunctionComponent<Props> = (props: Props) => {
    const [loginStatus, setloginStatus] = useState({
        isLoggedIn: AuthService.getIsLoggedIn(),
        token: AuthService.getToken()
    });

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

    function handleImageClose() {}

    return (
        <div>
            <Nav />
            <div className="container-fluid">
                <div className="row">
                    <Side page="home" handleImageClose={handleImageClose} />

                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h1 className="h2">Add new user </h1>
                        </div>

                        <div className="row">
                            <div className="col-sm-6 d-flex">
                                <Register />
                            </div>
                        </div>
                        <br />
                        <div className="border-top pt-10 mt-10"></div>
                        <br />

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

export default RegisterPage;
