/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { RootState } from '../reducers/rootReducer';

import { logClick, LogAction } from '../contexts/LogClicks';
import { deleteExistingIntersection, DeleteIntersectionAction } from '../contexts/intersection';

interface Props {
  intersection_id: number;
}

interface StateProps {
  user_id: number;
}

interface DispatchProps {
  deleteExistingIntersection: (id: string) => DeleteIntersectionAction;
  logClick: (log_message: string, user_id: number) => LogAction;
}

const TrafficIntensity = (props: Props & StateProps & DispatchProps): JSX.Element => {
  const { user_id, intersection_id } = props;
  const handleDelete = (id: string): void => {
    props.deleteExistingIntersection(id);
    props.logClick('Deleted Intersection', user_id);
  };
  return (
    <Link to="/" onClick={(): void => handleDelete(intersection_id.toString())}>
      <DeleteIcon />
    </Link>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  ...state,
  user_id: state.authentication.user_id,
});

const mapDispatchToProps: DispatchProps = {
  deleteExistingIntersection,
  logClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(TrafficIntensity);
