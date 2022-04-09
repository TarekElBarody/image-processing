import { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../assets/Login.css';
import DatePicker from 'react-date-picker';
import AuthService, { UserInsert } from '../services/auth.service';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const dateNow = (val?: Date): Date => {
    const date = val ? val : new Date();
    const gmtDate = new Date(date);
    const nowDate = new Date(gmtDate.getTime() - gmtDate.getTimezoneOffset() * 60 * 1000);
    return nowDate;
};

const diff = (start: Date, end: Date): number => {
    const date1 = new Date(start);
    const date2 = new Date(end);
    const oneYear = 1000 * 60 * 60 * 24 * 30 * 12;
    const diffInTime = date2.getTime() - date1.getTime();
    const diffInYears = Math.round(diffInTime / oneYear);
    return diffInYears;
};

type Props = {};

type State = {
    first_name: string;
    last_name: string;
    birthday: Date;
    formattedValue: string;
    email: string;
    password: string;
    mobile: string;
    successful: boolean;
    message: string;
};

export default class Register extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleBirthday = this.handleBirthday.bind(this);
        this.validationSchema = this.validationSchema.bind(this);
        this.state = {
            first_name: '',
            last_name: '',
            birthday: dateNow(),
            email: '',
            password: '',
            mobile: '',
            successful: false,
            message: '',
            formattedValue: ''
        };
    }

    validationSchema() {
        return Yup.object().shape({
            first_name: Yup.string()
                .test('len', 'must be between 2 and 20 characters.', (val: any) => val && val.toString().length >= 3 && val.toString().length <= 20)
                .required('This field is required!'),
            last_name: Yup.string()
                .test('len', 'must be between 2 and 20 characters.', (val: any) => val && val.toString().length >= 3 && val.toString().length <= 20)
                .required('This field is required!'),
            birthday: Yup.date()
                .test('DOB', 'Please choose a valid birthday 13+', (value: any) => {
                    return diff(dateNow(this.state.birthday), dateNow()) >= 13;
                })
                .required('birthday is Required'),
            mobile: Yup.string()
                .matches(phoneRegExp, 'Phone number is not valid')
                .test('len', 'must be between 11 and 20 characters.', (val: any) => val && val.toString().length >= 11 && val.toString().length <= 20)
                .required('This field is required!'),
            email: Yup.string().email('This is not a valid email.').required('This field is required!'),
            password: Yup.string()
                .test('len', 'The password must be between 6 and 40 characters.', (val: any) => val && val.toString().length >= 6 && val.toString().length <= 40)
                .required('This field is required!')
        });
    }

    componentDidMount() {
        document.body.style.backgroundColor = '#f5f5f5';
    }

    handleBirthday(val: Date) {
        this.setState({ birthday: val });
        console.log(val);
    }

    handleRegister(formValue: { first_name: string; last_name: string; birthday: Date; email: string; password: string; mobile: string }) {
        const user: UserInsert = formValue;

        this.setState({
            message: '',
            successful: false
        });

        AuthService.register(user).then(
            (response) => {
                this.setState({
                    message: response.data.message,
                    successful: true
                });
                window.location.href = '/login';
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

                this.setState({
                    successful: false,
                    message: resMessage
                });
            }
        );
    }

    render() {
        const { successful, message, birthday } = this.state;

        const initialValues = {
            first_name: '',
            last_name: '',
            birthday: dateNow(),
            email: '',
            password: '',
            mobile: ''
        };

        return (
            <main className="form-login">
                <h3 className="h3 mb-3 fw-normal">Create User Account</h3>
                <hr />
                <Formik initialValues={initialValues} validationSchema={this.validationSchema} onSubmit={this.handleRegister}>
                    <Form>
                        <div className="form-floating">
                            <div className="form-group">
                                <label htmlFor="first_name"> First Name </label>
                                <Field name="first_name" type="text" className="form-control" autoComplete="first_name" />
                                <ErrorMessage name="first_name" component="div" className="alert alert-danger" />
                            </div>
                        </div>
                        <div className="form-floating">
                            <div className="form-group">
                                <label htmlFor="last_name"> Last Name </label>
                                <Field name="last_name" type="text" className="form-control" autoComplete="last_name" />
                                <ErrorMessage name="last_name" component="div" className="alert alert-danger" />
                            </div>
                        </div>
                        <div className="form-floating">
                            <div className="form-group">
                                <label htmlFor="birthday"> Birth Date </label>
                                <DatePicker value={birthday} onChange={(date: Date) => this.handleBirthday(date)} name="birthday" className="form-control" />
                                <ErrorMessage name="birthday" component="div" className="alert alert-danger" />
                            </div>
                        </div>
                        <div className="form-floating">
                            <div className="form-group">
                                <label htmlFor="mobile"> Mobile </label>
                                <Field name="mobile" type="text" className="form-control" autoComplete="mobile" />
                                <ErrorMessage name="mobile" component="div" className="alert alert-danger" />
                            </div>
                        </div>
                        <div className="form-floating">
                            <div className="form-group">
                                <label htmlFor="email"> Email </label>
                                <Field name="email" type="email" className="form-control" autoComplete="email" />
                                <ErrorMessage name="email" component="div" className="alert alert-danger" />
                            </div>
                        </div>
                        <div className="form-floating">
                            <div className="form-group">
                                <label htmlFor="password"> Password </label>
                                <Field name="password" type="password" className="form-control" autoComplete="new-password" />
                                <ErrorMessage name="password" component="div" className="alert alert-danger" />
                            </div>
                        </div>
                        <div className="form-floating">
                            <div className="form-group">
                                <button type="submit" className="w-100 btn btn-lg btn-primary">
                                    <span>Sign Up</span>
                                </button>
                            </div>
                        </div>

                        {message && (
                            <div className="form-group">
                                <div className={successful ? 'alert alert-success' : 'alert alert-danger'} role="alert">
                                    {message}
                                </div>
                            </div>
                        )}
                    </Form>
                </Formik>
                <hr className="mt" />
                <p className="mt-1 mb-1 center">
                    If you have an account .. <a href="/login">Login</a>
                </p>
                <p className="mt-5 mb-1 center">
                    <a href="https://github.com/TarekElBarody">Tarek El-Barody</a> &copy; 2022
                </p>
            </main>
        );
    }
}
