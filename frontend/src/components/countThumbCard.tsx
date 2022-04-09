import React from 'react';

export interface Props {
    count: number;
}

const CountThumbCard: React.FunctionComponent<Props> = (props) => {
    return (
        <div className="card text-black bg-warning m-3 min-width-300">
            <div className="card-header">Images in Thumb folder</div>
            <div className="card-body">
                <h5 className="card-title" id="thumb-image-list-count">
                    {props.count} Cached Thumb
                </h5>
                <br />
                <button type="button" className="btn btn-danger" id="clear-history">
                    Clear cached thumbs
                </button>
            </div>
        </div>
    );
};

export default CountThumbCard;
