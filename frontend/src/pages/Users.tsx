import { Component } from 'react';

import UserService from '../services/user.service';
import EventBus from '../common/EventBus';

type Props = {};

type State = {
    content: [
        {
            id?: string;
            user_id?: string;
            url?: string;
            width?: number;
            height?: number;
            created?: Date;
            access?: number;
        }
    ];
};

export default class BoardUser extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            content: [{}]
        };
    }

    componentDidMount() {
        UserService.checkToken().then(
            (response) => {
                this.setState({
                    content: response.data.images
                });
            },
            (error) => {
                this.setState({
                    content: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch('logout');
                }
            }
        );
    }

    render() {
        return (
            <div className="container">
                <header className="jumbotron">
                    <h3>{this.state.content[0].id}</h3>
                </header>
            </div>
        );
    }
}
