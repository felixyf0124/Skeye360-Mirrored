import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RootState } from '../reducers/rootReducer';
import Header, { Head } from '../components/Header';
// import Simulator from './simulator/Scene';
import NorthChart from '../components/NorthChart';
import { deleteExistingIntersection } from '../contexts/intersection';
import AvgWaitTimeChart from '../components/AvgWaitTimeChart';

interface StateProps {
  authenticated: boolean;
  intersectionId: string;
  error: string;
}

interface DispatchProps {
  deleteExistingIntersection: (id: string) => any;
}

const StreetView = (props: StateProps & DispatchProps): JSX.Element => {
  const [state] = React.useState(props);
  const {
    authenticated,
    intersectionId,
  } = state;
  if (!authenticated) return <Redirect push to="/login" />;

  // eslint-disable-next-line consistent-return
  const handleDelete = (id: string): any => {
    state.deleteExistingIntersection(id);
  };

  return (
    <div>
      <Header />
      <Head>
        <Link to={`/intersection/edit/${intersectionId}`} className="header-text">Edit</Link>
        <Link to="/" onClick={(): any => handleDelete(intersectionId)} className="header-text">Delete</Link>
      </Head>
      {/* <Simulator /> */}
      <div className="charts-row">
        <NorthChart />
        <AvgWaitTimeChart />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  authenticated: state.authentication.authenticated,
  intersectionId: state.router.location.pathname.substring(state.router.location.pathname.lastIndexOf('/') + 1),
  error: state.intersection.error,
});

const mapDispatchToProps: DispatchProps = {
  deleteExistingIntersection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StreetView);
