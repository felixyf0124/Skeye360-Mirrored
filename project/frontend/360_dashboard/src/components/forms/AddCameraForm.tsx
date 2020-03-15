/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { push } from 'connected-react-router';
import { makeStyles } from '@material-ui/core/styles';
import { RootState } from '../../reducers/rootReducer';
import { addNewCamera } from '../../contexts/camera';
import { logClick } from '../../contexts/LogClicks';

const useStyles = makeStyles(() => ({
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
    height: '12rem',
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

interface State {
  intersection_id: number;
}

interface StateProps {
  camera_url: string;
  error: string;
  user_id: number;
}

interface DispatchProps {
  historyPush: (url: string) => void;
  addNewCamera: (camera_url: string, intersection_id: string) => any;
  logClick: (log_message: string, user_id: number) => any;
}

const AddCameraForm = (props: State & StateProps & DispatchProps): JSX.Element => {
  const [state, setState] = React.useState(props);
  const { camera_url, intersection_id } = state;

  const { user_id, error } = props;

  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  // eslint-disable-next-line consistent-return
  const handleSubmit = (): any => {
    const { logClick } = props;
    props.addNewCamera(state.camera_url, String(state.intersection_id));
    logClick('Added Intersection', user_id);
  };

  const classes = useStyles();

  return (
    <div>
      <div className={classes.content}>
        {error !== '' ? (
          <div className="form-group">
            <div className={classes.invalid}>{error}</div>
          </div>
        ) : (
          <div />
        )}
        <form
          onSubmit={(e): void => {
            e.preventDefault();
            handleSubmit();
            history.push(`/intersection/edit/${intersection_id}`);
          }}
        >
          <div className={classes.innerBox}>
            <div className="form-group">
              <div className={classes.textEntry}>
                <h6>Add New Camera URL</h6>
              </div>
              <input
                type="text"
                name="camera_url"
                value={camera_url}
                className={classes.textField}
                placeholder="e.g. 111.222.333.444:5555"
                onChange={handleChange}
              />
            </div>
            <div className={classes.centeredBox}>
              <button className={classes.addButton} type="submit">
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  camera_url: '',
  error: state.intersection.error,
  user_id: state.authentication.user_id,
});

const mapDispatchToProps: DispatchProps = {
  historyPush: push,
  addNewCamera,
  logClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCameraForm);
