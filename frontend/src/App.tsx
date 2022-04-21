import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import './assets/App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Error404 from './pages/Error404';
import Manager from './pages/Manager';
import RegisterPage from './pages/RegisterPage';

type Props = {};

const App: React.FunctionComponent<Props> = (props) => {
    return (
        //const { currentUser } = this.state;

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/register-page" element={<RegisterPage />} />
                <Route path="/login" element={<Login history="" />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/manager" element={<Manager />} />

                <Route path="*" element={<Error404 />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
