/* eslint-disable @typescript-eslint/camelcase */
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

    latitude: number;
    longitude: number;
    intersection_name: string;

    error: string;
}

interface DispatchProps {
    historyPush: (url: string) => void;
}

const AddCamera = (props: StateProps & DispatchProps): JSX.Element => {
  const [state, setState] = React.useState(props);
  const {
    latitude, longitude, intersection_name, error,
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
        latitude={latitude}
        longitude={longitude}
        intersection_name={intersection_name}

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

  latitude: 0,
  longitude: 0,
  intersection_name: 'Guy St/St-Cath',

  error: '',
});

const mapDispatchToProps: DispatchProps = {
  historyPush: push,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddCamera);
