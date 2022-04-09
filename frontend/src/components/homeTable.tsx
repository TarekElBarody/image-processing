import React from 'react';
import { Table } from 'react-bootstrap';
import { ImageHistory } from '../services/home.service';

export interface Props {
    imageHistory: ImageHistory[];
}

const HomeTableData: React.FunctionComponent<Props> = (props) => {
    return (
        <tbody>
            {props.imageHistory.map((value: ImageHistory, index: number) => {
                return (
                    <tr key={index}>
                        <td>{value.num}</td>
                        <td>{value.time}</td>
                        <td>{value.duration}</td>
                        <td>{value.process}</td>
                    </tr>
                );
            })}
        </tbody>
    );
};

const HomeTable: React.FunctionComponent<Props> = (props) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Num</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th>Process</th>
                </tr>
            </thead>
            <HomeTableData imageHistory={props.imageHistory}></HomeTableData>
            <tfoot>
                <tr>
                    <th>Num</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th>Process</th>
                </tr>
            </tfoot>
        </Table>
    );
};
export default HomeTable;
