import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RootState } from '../reducers/rootReducer';
import Header, { Head } from '../components/Header';
import Simulator from './simulator/Scene';
import NorthChart from '../components/NorthChart';
import SouthChart from '../components/SouthChart';
import { deleteIntersection } from '../api/intersection';

interface StateProps {
  authenticated: boolean;
  intersectionId: string;
}

interface DispatchProps {
  deleteIntersection: (id: string) => any;
}

const StreetView = (props: StateProps & DispatchProps): JSX.Element => {
  const [state] = React.useState(props);
  const {
    authenticated,
    intersectionId,
  } = state;
  if (!authenticated) return <Redirect push to="/login" />;

  const handleDelete = (id: string): any => {
    deleteIntersection(id);
    return (<Redirect push to="/" />);
  };

  return (
    <div>
      <Header />
      <Head>
        <Link to={`/intersection/edit/${intersectionId}`} className="header-text">Edit</Link>
      </Head>
      <button onClick={(): any => handleDelete(intersectionId)} type="submit">Delete</button>
      {/* <Simulator />
      <div className="charts-row">
        <NorthChart />
        <SouthChart />
      </div> */}
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  authenticated: state.authentication.authenticated,
  intersectionId: state.router.location.pathname.substring(state.router.location.pathname.lastIndexOf('/') + 1),
});

const mapDispatchToProps: DispatchProps = {
  deleteIntersection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StreetView);
