/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { editExistingCamera, EditCameraAction } from '../contexts/camera';
import { RootState } from '../reducers/rootReducer';
import { logClick } from '../contexts/LogClicks';
import DeleteCameraButton from './DeleteCameraButton';

// Generic flexboxes styling
const HorizontalFlexBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: stretch;
  align-content: stretch;
`;

interface Props {
  id: string;
  camera_url: string;
  intersection_id: string;
}

interface StateProps {
  error: string;
  user_id: number;
}

interface DispatchProps {
  editExistingCamera: (id: string, camera_url: string, intersection_id: string) => EditCameraAction;
  logClick: (log_message: string, user_id: number) => any;
}

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
    marginBottom: '5rem',
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

const EditCameraForm = (props: Props & StateProps & DispatchProps): JSX.Element => {
  const [state, setState] = React.useState(props);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const { user_id, error } = props;

  const history = useHistory();

  const handleSubmit = (): void => {
    // const { logClick } = props;
    props.editExistingCamera(state.id, state.camera_url, state.intersection_id);
    props.logClick('Edited Camera', user_id);
  };

  const classes = useStyles();

  return (
    <div>
      <div className={classes.content}>
        {error !== '' ? (
          <div className="form-group">
            <div className={classes.invalid}>{state.error}</div>
          </div>
        ) : (
          <div />
        )}
        <form
          onSubmit={(e): void => {
            e.preventDefault();
            handleSubmit();
            history.push(`/intersection/edit/${state.intersection_id}`);
          }}
        >
          <div className={classes.innerBox}>
            <div className="form-group">
              <div className={classes.textEntry}>
                <h5>{`Camera ID: ${state.id}`}</h5>
              </div>
            </div>
            <div className="form-group">
              <div className={classes.textEntry}>Camera URL</div>
              <input
                type="text"
                name="camera_url"
                value={state.camera_url}
                placeholder="e.g. 111.222.333.444:5555"
                className={classes.textField}
                onChange={handleChange}
              />
            </div>
            <HorizontalFlexBox>
              <div className={classes.centeredBox}>
                <button className={classes.addButton} type="submit">
                  Edit
                </button>
              </div>
              <div className={classes.centeredBox}>
                <Link to={`/camview/${state.id}`}>
                  <button className={classes.addButton} type="submit">
                    View
                  </button>
                </Link>
              </div>
              <div className={classes.centeredBox}>
                <DeleteCameraButton
                  id={Number(state.id)}
                  intersection_id={Number(state.intersection_id)}
                />
              </div>
            </HorizontalFlexBox>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  error: state.intersection.error,
  user_id: state.authentication.user_id,
});

const mapDispatchToProps: DispatchProps = {
  editExistingCamera,
  logClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCameraForm);
