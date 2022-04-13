/* eslint-disable testing-library/no-unnecessary-act */
import * as React from 'react';
import { cleanup, fireEvent, render, screen, act } from '@testing-library/react';

import App from '../App';
import Login from '../pages/Login';

global.localStorage.clear();

afterEach(cleanup);
beforeEach(() => {
    global.localStorage.clear();
});

afterEach(() => {
    jest.resetAllMocks();
});
afterAll(() => {
    jest.clearAllMocks();
});

test('App', async () => {
    render(<App />);

    await act(async () => {
        const button = screen.getByRole('button', { name: 'Login', hidden: true });
        expect(button).toBeDefined();
        const email = screen.getByRole('textbox', { name: 'Email address', hidden: true });
        expect(email).toBeDefined();
        const password = screen.getByLabelText('Password');
        expect(password).toBeDefined();
    });

    // manually trigger the callback
});

test('Login', async () => {
    render(<Login history="" />);

    // manually trigger the callback
    const button = screen.getByRole('button', { name: 'Login', hidden: true });
    const email = screen.getByRole('textbox', { name: 'Email address', hidden: true });
    const password = screen.getByLabelText('Password');
    await act(async () => {
        fireEvent.change(email, { target: { value: 'admin@admin.com' } });
        fireEvent.change(password, { target: { value: '123456789' } });
        fireEvent.click(button);
        expect(await screen.findByText('Process Logging in ..')).toBeDefined();
    });

    window.location.reload();

    // manually trigger the callback
    //tree.children?.find('form')?.children?.find('email');
    expect(window.location.href).toBe('http://localhost/');
});
