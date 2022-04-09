import React from 'react';

export interface Props {
    count: number;
}

const CountFullCard: React.FunctionComponent<Props> = (props) => {
    return (
        <div className="card text-white bg-primary m-3 min-width-300">
            <div className="card-header">Images in Full folder</div>
            <div className="card-body">
                <h5 className="card-title" id="full-image-list-count">
                    {props.count} Full Image
                </h5>
                <br />
                <a type="button" className="btn btn-light " href="./manager">
                    View Images List
                </a>
            </div>
        </div>
    );
};

export default CountFullCard;
