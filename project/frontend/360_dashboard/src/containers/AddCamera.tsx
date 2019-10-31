import React from 'react';
import { RootState } from '../reducers/rootReducer';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import { push } from 'connected-react-router';
import CameraForm from '../components/CameraForm';

interface StateProps {
    path: string;
    authenticated: boolean,
    username: string;

    city: string;
    lat: number;
    lng: number;
    camera_url: string;
    street: string;

    error: string;
}

interface DispatchProps {
    historyPush: (url: string) => void;
}

const AddCamera = (props: StateProps & DispatchProps): JSX.Element => {
    const [ state, setState ] = React.useState(props);
    const { city, lat, lng, camera_url, street, error } = state;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const { historyPush } = props;
        historyPush('/camera/add');
    };

    if (!props.authenticated) return <Redirect push to={'/login'} />;

    return (
        <div>
            <Header />
            <CameraForm
                city={city}
                lat={lat}
                lng={lng}
                camera_url={camera_url}
                street={street}
                error={error}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </div>
    );
}

const mapStateToProps = (state: RootState): StateProps => ({
    path: '/streetview/add',
    authenticated: state.authentication.authenticated,
    username: state.authentication.username,
    
    city: 'Montreal',
    lat: 0,
    lng: 0,
    camera_url: '127.0.0.0.1:1234',
    street: 'Guy St/St-Cath',

    error: '',
});

const mapDispatchToProps: DispatchProps = {
    historyPush: push,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AddCamera);