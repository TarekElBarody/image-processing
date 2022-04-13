import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import '../assets/Login.css';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { Assign, ObjectShape, AnyObject, TypeOfShape, AssertsShape } from 'yup/lib/object';
import { RequiredStringSchema } from 'yup/lib/string';

type FormValues = {
    email: string;
    password: string;
};

const useYupValidationResolver = (
    validationSchema: Yup.ObjectSchema<
        Assign<ObjectShape, { email: RequiredStringSchema<string | undefined, AnyObject>; password: RequiredStringSchema<string | undefined, AnyObject> }>,
        AnyObject,
        TypeOfShape<Assign<ObjectShape, { email: RequiredStringSchema<string | undefined, AnyObject>; password: RequiredStringSchema<string | undefined, AnyObject> }>>,
        AssertsShape<Assign<ObjectShape, { email: RequiredStringSchema<string | undefined, AnyObject>; password: RequiredStringSchema<string | undefined, AnyObject> }>>
    >
) =>
    useCallback(
        async (data) => {
            try {
                const values = await validationSchema.validate(data, {
                    abortEarly: false
                });

                return {
                    values,
                    errors: {}
                };
            } catch (errors: any) {
                return {
                    values: {},
                    errors: errors.inner.reduce(
                        (allErrors: any, currentError: any) => ({
                            ...allErrors,
                            [currentError.path]: {
                                type: currentError.type ?? 'validation',
                                message: currentError.message
                            }
                        }),
                        {}
                    )
                };
            }
        },
        [validationSchema]
    );

export default function Login() {
    const validationSchema = useMemo(
        () =>
            Yup.object().shape({
                email: Yup.string().email('This is not a valid email.').required('This field is required!'),
                password: Yup.string()
                    .test('len', 'The password must be between 6 and 40 characters.', (val: any) => val && val.toString().length >= 6 && val.toString().length <= 40)
                    .required('This field is required!')
            }),
        []
    );
    const resolver = useYupValidationResolver(validationSchema);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: resolver
    });
    const onSubmit = handleSubmit((data) => {
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
    });

    return (
        <main className="form-login">
            <h3 className="h3 mb-3 fw-normal">Please sign in</h3>
            <hr />
            <form onSubmit={onSubmit}>
                <div className="form-floating">
                    <div className="form-group mb-3">
                        <label htmlFor="email">Email Address</label>
                        <input {...register('email')} placeholder="Email Address" id="email" name="email" type="text" className="form-control" autoComplete="email" />
                        {errors?.email && <span role="alert">{errors.email.message}</span>}
                    </div>
                </div>
                <div className="form-floating">
                    <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            {...register('password')}
                            placeholder="Password"
                            id="password"
                            name="password"
                            type="password"
                            className="form-control"
                            autoComplete="current-password"
                            aria-label="password"
                        />
                        {errors.password && <span role="alert">{errors.password.message}</span>}
                    </div>
                </div>
                <div className="form-group">
                    {' '}
                    <button type="submit" className="w-100 btn btn-lg btn-primary" name="Login">
                        <span>Login</span>
                    </button>
                </div>
            </form>
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
