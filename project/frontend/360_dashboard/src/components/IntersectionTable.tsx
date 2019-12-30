/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { Link } from 'react-router-dom';
import { STATE as districtState } from '../contexts/districts';
import DeleteIntersectionButton from './DeleteIntersectionButton';

/* Tables from Material-UI:
  https://material-ui.com/components/tables/ */

// CSS Styling
const useStyles = makeStyles((theme) => ({
  addButton: {
    backgroundColor: '#04A777',
    marginTop: '1rem',
  },
  plusIcon: {
    color: '#FFFFFF',
  },
  content: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '1rem',
    paddingTop: '5rem',
  },
  table: {
    minWidth: 650,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
}));

const IntersectionTable = (districts: districtState): JSX.Element => {
  // Intersection Table that retrieves all of the intersections of a district
  // And displays their information in the table.
  const classes = useStyles();
  return (
    <main className={classes.content}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="intersection table">
          <TableHead>
            <TableRow>
              <TableCell>Intersection Name</TableCell>
              <TableCell>District</TableCell>
              <TableCell>Traffic Intensity</TableCell>
              <TableCell>Streetview</TableCell>
              <TableCell>Simulator</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {districts.districts[0] === undefined ? (
              <TableRow>
                <TableCell component="th" scope="row" />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            ) : (
              districts.districts[0].intersections.map((intersection) => (
                <TableRow key={intersection.id}>
                  <TableCell component="th" scope="row">
                    {intersection.intersection_name}
                  </TableCell>
                  <TableCell>{districts.districts[0].district_name}</TableCell>
                  <TableCell>Undefined</TableCell>
                  <TableCell>
                    <Link to={`/streetview/${intersection.id}`}>
                      <CallMadeIcon />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/camview/${intersection.id}`}>
                      <CallMadeIcon />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/intersection/edit/${intersection.id}`}>
                      <EditIcon />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <DeleteIntersectionButton intersection_id={intersection.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Link to="/intersection/add">
        <Fab className={classes.addButton} aria-label="add">
          <AddIcon className={classes.plusIcon} />
        </Fab>
      </Link>
    </main>
  );
};

export default IntersectionTable;