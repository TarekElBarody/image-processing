import { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthService from '../services/auth.service';
import '../assets/Login.css';
import Swal from 'sweetalert2';

interface Props {
    history: string;
}

type State = {
    email: string;
    password: string;
    loading: boolean;
    message: string;
};

export default class Login extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);

        this.state = {
            email: '',
            password: '',
            loading: false,
            message: ''
        };
    }

    validationSchema() {
        return Yup.object().shape({
            email: Yup.string().email('This is not a valid email.').required('This field is required!'),
            password: Yup.string()
                .test('len', 'The password must be between 6 and 40 characters.', (val: any) => val && val.toString().length >= 6 && val.toString().length <= 40)
                .required('This field is required!')
        });
    }

    handleLogin(formValue: { email: string; password: string }) {
        Swal.fire({
            title: 'Process Logging in ..',
            icon: 'info',
            text: 'Please wait until confirmation is completed.',
            showConfirmButton: !1,
            allowOutsideClick: !1,
            allowEscapeKey: !1,
            didOpen: function () {
                Swal.showLoading();
            }
        });
        const { email, password } = formValue;

        this.setState({
            message: '',
            loading: true
        });

        AuthService.login(email, password).then(
            () => {
                Swal.close();
                window.location.href = '/';
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                Swal.fire({
                    text: resMessage,
                    icon: 'warning',
                    buttonsStyling: !0,
                    confirmButtonText: 'Ok, I understand',
                    customClass: {
                        confirmButton: 'btn font-weight-bold btn-primary'
                    }
                });
                this.setState({
                    loading: false,
                    message: resMessage
                });
            }
        );
    }

    render() {
        const { loading, message } = this.state;

        const initialValues = {
            email: '',
            password: ''
        };

        return (
            <main className="form-login">
                <h3 className="h3 mb-3 fw-normal">Please sign in</h3>
                <hr />
                <Formik initialValues={initialValues} validationSchema={this.validationSchema} onSubmit={this.handleLogin}>
                    <Form>
                        <div className="form-floating">
                            <div className="form-group mb-3">
                                <label htmlFor="email">Email address</label>
                                <Field id="email" name="email" type="text" className="form-control" autoComplete="email" label="email" />
                                <ErrorMessage name="email" component="div" className="alert alert-danger" />
                                <p className="text-muted">We'll never share your email with anyone else.</p>
                            </div>
                        </div>
                        <div className="form-floating">
                            <div className="form-group mb-3">
                                <label htmlFor="password">Password</label>
                                <Field id="password" name="password" type="password" className="form-control" autoComplete="current-password" label="password" />
                                <ErrorMessage name="password" component="div" className="alert alert-danger" />
                            </div>
                        </div>

                        <div className="form-group"></div>
                        <button type="submit" className="w-100 btn btn-lg btn-primary" name="Login">
                            {loading && <span className="spinner-border spinner-border-sm"></span>}
                            <span>Login</span>
                        </button>
                        {message && (
                            <div className="form-group">
                                <div className="alert alert-danger" role="alert">
                                    {message}
                                </div>
                            </div>
                        )}
                    </Form>
                </Formik>
                <hr className="mt" />
                <p className="mt-1 mb-1 center">
                    If you dont have account .. <a href="/register">Create New</a>
                </p>
                <p className="mt-5 mb-1 center">
                    <a href="https://github.com/TarekElBarody">Tarek El-Barody</a> &copy; 2022
                </p>
            </main>
        );
    }
}
