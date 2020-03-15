/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
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

const deleteInt = createMuiTheme({
  overrides: {
    MuiIconButton: {
      root: {
        color: '#007BFF',
        '&:hover': {
          color: '#0056B3',
          backgroundColor: 'transparent',
        },
        '&:focus': {
          outline: 'none',
        },
      },
    },
    MuiButtonBase: {
      root: {
        color: '#007BFF',
        '&:focus': {
          outline: 'none',
          backgroundColor: '#0056B3',
          color: 'white',
        },
      },
    },
    MuiButton: {
      textPrimary: {
        '&:hover': {
          backgroundColor: '#0056B3',
          color: 'white',
        },
      },
    },
  },
});

const DeleteIntersectionButton = (props: Props & StateProps & DispatchProps): JSX.Element => {
  const { user_id, intersection_id } = props;
  const handleDelete = (id: string): void => {
    props.deleteExistingIntersection(id);
    props.logClick('Deleted Intersection', user_id);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={deleteInt}>
      <div>
        <IconButton onClick={handleClickOpen}>
          <DeleteIcon />
        </IconButton>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Intersection</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure that you want to delete this intersection?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={(): void => handleDelete(intersection_id.toString())} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteIntersectionButton);
