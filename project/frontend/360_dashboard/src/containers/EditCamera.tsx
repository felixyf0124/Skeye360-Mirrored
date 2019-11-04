import React from 'react';
import { RootState } from '../reducers/rootReducer';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import { push } from 'connected-react-router';

interface StateProps {
    path: string;
    authenticated: boolean,
    username: string;

    city: string;
    lat: number;
    lng: number;
    ipaddress: string;
    red_time: number;
    yellow_time: number;
    green_time: number;

    error: string;
}

interface DispatchProps {
    historyPush: (url: string) => void;
}

const EditCamera = (props: StateProps & DispatchProps): JSX.Element => {
    const [ state, setState ] = React.useState(props);
    const { city, lat, lng, ipaddress, red_time, yellow_time, green_time } = state;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const onDelete = (): void => {
        window.confirm("Are you sure you want to delete this camera location?");
    }

    if (!props.authenticated) return <Redirect push to={'/login'} />;

    return (
        <div>
            <Header />
            <div className="login-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                }}>
                    <div className="form-group">
                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            value={city}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Latitude</label>
                        <input
                            type="text"
                            name="lat"
                            value={lat}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Longitude</label>
                        <input
                            type="text"
                            name="lng"
                            value={lng}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Camera IP Address</label>
                        <input
                            type="text"
                            name="ipaddress"
                            value={ipaddress}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Red Light Time</label>
                        <input
                            type="text"
                            name="red_time"
                            value={red_time}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Yellow Light Time</label>
                        <input
                            type="text"
                            name="yellow_time"
                            value={yellow_time}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Green Light Time</label>
                        <input
                            type="text"
                            name="green_time"
                            value={green_time}
                            onChange={handleChange}
                        />
                    </div>
                    <button name="update" type="submit">
                        Update
                    </button>
                    <button name="delete" type="submit" onClick={
                        () => onDelete()
                    }>
                        Delete
                    </button>
                </form>
            </div>
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
    ipaddress: '127.0.0.0.1:1234',
    red_time: 15,
    yellow_time: 5,
    green_time: 15,

    error: '',
});

const mapDispatchToProps: DispatchProps = {
    historyPush: push,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditCamera);