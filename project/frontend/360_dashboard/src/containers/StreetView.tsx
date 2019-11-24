/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../reducers/rootReducer';
import Header, { Head } from '../components/Header';
import Simulator from './simulator/Scene';
import NorthChart from '../components/NorthChart';
import AvgWaitTimeChart from '../components/AvgWaitTimeChart';
import {
  getExistingIntersection,
  deleteExistingIntersection,
  resetIntersection,
  ResetIntersectionAction,
} from '../contexts/intersection';
import { getDistricts } from '../contexts/districts';
import { logClick } from '../contexts/LogClicks';

interface StateProps {
  intersectionId: string;
  intersectionName: string;
  error: string;
  user_id: number;
}

interface DispatchProps {
  deleteExistingIntersection: (id: string) => any;
  getExistingIntersection: (id: string) => any;
  getDistricts: () => any;
  resetIntersection(): ResetIntersectionAction;
  logClick: (
    log_message: string,
    user_id: number,
  ) => any;
}

class StreetView extends React.Component<StateProps & DispatchProps> {
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { intersectionId, getExistingIntersection } = this.props;
    getExistingIntersection(intersectionId);
  }

  public componentWillUnmount(): void {
    // eslint-disable-next-line no-shadow
    const { resetIntersection } = this.props;
    resetIntersection();
  }

  public render(): JSX.Element {
    const { intersectionId, intersectionName } = this.props;

    const {
      user_id,
    } = this.props;

    // eslint-disable-next-line consistent-return
    const handleDelete = (id: string): any => {
      // eslint-disable-next-line no-shadow
      const { deleteExistingIntersection } = this.props;
      const { logClick } = this.props;
      deleteExistingIntersection(id);
      logClick('Deleted Intersection', user_id);
    };

    return (
      <div>
        <Header />
        <h1 className="header-text">{intersectionName}</h1>
        <Head>
          <Link to={`/intersection/edit/${intersectionId}`} className="header-text">
            Edit
          </Link>
          <Link to="/" onClick={(): any => handleDelete(intersectionId)} className="header-text">
            Delete
          </Link>
        </Head>
        <Simulator />
        <div className="charts-row">
          <NorthChart />
          <AvgWaitTimeChart />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  intersectionId: state.router.location.pathname.substring(
    state.router.location.pathname.lastIndexOf('/') + 1,
  ),
  intersectionName: state.intersection.intersection_name,
  error: state.intersection.error,
  user_id: state.authentication.user_id,
});

const mapDispatchToProps: DispatchProps = {
  deleteExistingIntersection,
  getExistingIntersection,
  getDistricts,
  resetIntersection,
  logClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(StreetView);
