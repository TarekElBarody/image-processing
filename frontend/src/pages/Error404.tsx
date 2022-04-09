import React from 'react';
import '../assets/Error404.css';

export interface Props {}

const Error404: React.FunctionComponent<Props> = (props) => {
    return (
        <div className="Container">
            <div className="Card">
                <h1>404</h1>
                <h2>Not Found</h2>
                <p>The resource requested could not be found on this server!</p>
                <a href="/">goto the home page</a>
            </div>
        </div>
    );
};

export default Error404;
