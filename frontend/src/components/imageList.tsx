import React from 'react';
import { Card } from 'react-bootstrap';
import { ImageList } from '../services/home.service';

export interface Props {
    imageList: ImageList[];
    fit: string;
    catch: number;
    size: number;
}

const ImageListBox: React.FunctionComponent<Props> = (props) => {
    return (
        <div>
            {props.imageList.map((value: ImageList, index: number) => {
                const filename = `${value.url}?width=${props.size}&height=${props.size}&fit=${props.fit}&catching=${props.catch}`;
                return (
                    <Card key={value.id} style={{ width: 'auto', float: 'left', margin: '5px' }}>
                        <Card.Body>
                            <img src={filename} alt="" width={props.size} height={props.size} />
                        </Card.Body>
                    </Card>
                );
            })}
        </div>
    );
};

const ImageListGrid: React.FunctionComponent<Props> = (props) => {
    return (
        <div className="row">
            <h6 className="m-2" key="check-counter">
                Total Images {props.imageList.length}
            </h6>
            <div className="container-fluid" key="ImageList">
                <ImageListBox imageList={props.imageList} fit={props.fit} size={props.size} catch={props.catch} />
            </div>
        </div>
    );
};
export default ImageListGrid;
