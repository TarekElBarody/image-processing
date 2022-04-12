/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react';
import renderer from 'react-test-renderer';
import { cleanup, fireEvent, render, screen, act } from '@testing-library/react';

import App from '../App';
afterEach(cleanup);

test('App', async () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON() as renderer.ReactTestRendererJSON;
    expect(tree).toMatchSnapshot();
    render(<App />);
    // manually trigger the callback
    const button = screen.getByRole('button', { name: 'Login' });
    expect(button).toBeInTheDocument();
    const email = screen.getByRole('textbox', { name: 'Email address' });
    expect(email).toBeInTheDocument();
    const password = screen.getByLabelText('Password');
    expect(password).toBeInTheDocument();
    await act(async () => {
        fireEvent.change(email, { target: { value: 'admin@admin.com' } });
        fireEvent.change(password, { target: { value: '123456789' } });
        fireEvent.click(button);
    });
    // manually trigger the callback
    //tree.children?.find('form')?.children?.find('email');
    expect(screen.getByText('Process Logging in ..')).toBeInTheDocument();

    // re-rendering
    tree = component.toJSON() as renderer.ReactTestRendererJSON;
    expect(tree).toMatchSnapshot();
});
