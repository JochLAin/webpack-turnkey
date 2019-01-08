import { Component } from 'react';
import { prevent } from '@middlewares/event';

export default class SuperComponent extends Component {
    prevent = prevent;

    toggleState = (...names) => {
        this.setState(names.reduce((accu, name) => {
            return Object.assign({}, accu, {
                [name]: !this.state[name]
            });
        }));
    }
}