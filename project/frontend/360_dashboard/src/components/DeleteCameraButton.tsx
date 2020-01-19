/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { RootState } from '../reducers/rootReducer';

import { logClick, LogAction } from '../contexts/LogClicks';
import { deleteExistingCamera, DeleteCameraAction } from '../contexts/camera';

export const useStyles = makeStyles(() => ({
  root: {
    '& > *': {
      width: 200,
    },
  },

  centeredBox: {
    display: 'flex',
    justifyContent: 'center',
  },

  textEntry: {
    color: '#FFFFFF',
    marginBottom: '0rem',
  },

  addButton: {
    marginTop: '1em',
    height: '2.5rem',
    width: '6rem',
    border: 'none',
    background: '#04A777',
    color: '#ffffff',
    borderRadius: '5px',
  },

  content: {
    backgroundColor: '#212121',
    margin: 'auto',
    width: '25rem',
    height: '15rem',
    border: '1px solid grey',
    borderRadius: '15px',
    zIndex: 1,
  },

  invalid: {
    color: '#FFFFFF',
  },

  textField: {
    marginTop: '1rem',
    marginBottom: '1rem',
    background: 'transparent',
    outline: 0,
    borderWidth: '0 0 1px',
    borderColor: 'grey',
    color: '#FFFFFF',
  },

  innerBox: {
    marginTop: '2rem',
  },
}));

interface Props {
  id: number;
  intersection_id: number;
}

interface StateProps {
  user_id: number;
}

interface DispatchProps {
  deleteExistingCamera: (id: string) => DeleteCameraAction;
  logClick: (log_message: string, user_id: number) => LogAction;
}

const DeleteCameraButton = (props: Props & StateProps & DispatchProps): JSX.Element => {
  const { user_id, id, intersection_id } = props;
  const classes = useStyles();
  const handleDelete = (id: string): void => {
    props.deleteExistingCamera(id);
    props.logClick('Deleted Camera', user_id);
  };
  return (
    <Link
      to={`/intersection/edit/${intersection_id}`}
      onClick={(): void => handleDelete(id.toString())}
    >
      <button className={classes.addButton} type="submit">
        Delete
      </button>
    </Link>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  ...state,
  user_id: state.authentication.user_id,
});

const mapDispatchToProps: DispatchProps = {
  deleteExistingCamera,
  logClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteCameraButton);
