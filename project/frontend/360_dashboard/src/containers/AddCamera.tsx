import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push } from 'connected-react-router';
import Header from '../components/Header';
import { RootState } from '../reducers/rootReducer';
import CameraForm from '../components/CameraForm';

interface StateProps {
    path: string;
    authenticated: boolean;
    username: string;

    city: string;
    lat: number;
    lng: number;
    cameraURL: string;
    street: string;

    error: string;
}

interface DispatchProps {
    historyPush: (url: string) => void;
}

const AddCamera = (props: StateProps & DispatchProps): JSX.Element => {
  const [state, setState] = React.useState(props);
  const {
    city, lat, lng, cameraURL, street, error,
  } = state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = (): void => {
    const { historyPush } = props;
    historyPush('/camera/add');
  };

  if (!state.authenticated) return <Redirect push to="/login" />;

  return (
    <div>
      <Header />
      <CameraForm
        city={city}
        lat={lat}
        lng={lng}
        cameraURL={cameraURL}
        street={street}
        error={error}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  path: '/streetview/add',
  authenticated: state.authentication.authenticated,
  username: state.authentication.username,

  city: 'Montreal',
  lat: 0,
  lng: 0,
  cameraURL: '127.0.0.0.1:1234',
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
