import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import { RootState } from '../reducers/rootReducer';

interface StateProps {
    path: string;
    authenticated: boolean;
    username: string;
    log_message: string;
}

interface DispatchProps {
    historyPush: (url: string) => void;
    logClick: (
        username: string,
        log_message: string,
    ) => any;

}

const LogClick = (props: StateProps & DispatchProps): JSX.Element => {
    const [state, setState] = React.useState(props);
    const {
        username, log_message
    } = state;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setState({...state, [e.target.name]: e.target.value });
    };

    const handleClick = (): void => {
        const { historyPush } = props;
        historyPush('/userlogs/');
        props.logClick(
            state.username,
            state.log_message,
        );
    };
};