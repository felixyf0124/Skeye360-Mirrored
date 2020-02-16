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
import LaunchIcon from '@material-ui/icons/Launch';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { STATE as districtState } from '../contexts/districts';
import DeleteIntersectionButton from './DeleteIntersectionButton';
import TrafficIntensity from './TrafficIntensity';
import CameraConnectionStatus from './CameraConnectionStatus';
import { Response as cameraResponse } from '../api/camera';

// Generic flexboxes styling
const VerticalFlexBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: stretch;
  align-content: stretch;
`;

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
              <TableCell align="center">Intersection Name</TableCell>
              <TableCell align="center">District</TableCell>
              <TableCell align="center">Streetview</TableCell>
              <TableCell align="center">Cameras</TableCell>
              <TableCell align="center">Traffic Intensity</TableCell>
              <TableCell align="center">Camera Status</TableCell>
              <TableCell align="center">Edit</TableCell>
              <TableCell align="center">Delete</TableCell>
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
                <TableCell />
              </TableRow>
            ) : (
              districts.districts[0].intersections.map((intersection) => (
                <TableRow key={intersection.id}>
                  <TableCell component="th" scope="row" align="center">
                    {intersection.intersection_name}
                  </TableCell>
                  <TableCell align="center">{districts.districts[0].district_name}</TableCell>
                  <TableCell align="center">
                    <Link to={`/streetview/${intersection.id}`}>
                      <LaunchIcon />
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    <VerticalFlexBox>
                      {intersection.cameras.map((camera: cameraResponse) => (
                        <Link key={camera.id} to={`/camview/${camera.id}`}>
                          <LaunchIcon />
                        </Link>
                      ))}
                    </VerticalFlexBox>
                  </TableCell>
                  <TableCell align="center">
                    {intersection.cameras.map((camera: cameraResponse) => (
                      <a key={camera.id} href={`http://${camera.camera_url}/los/`}>
                        <TrafficIntensity camera_id={camera.id} camera_url={camera.camera_url} />
                      </a>
                    ))}
                  </TableCell>
                  <TableCell align="center">
                    {intersection.cameras.map((camera: cameraResponse) => (
                      <CameraConnectionStatus key={camera.id} camera_id={camera.id} />
                    ))}
                  </TableCell>
                  <TableCell align="center">
                    <Link to={`/intersection/edit/${intersection.id}`}>
                      <EditIcon />
                    </Link>
                  </TableCell>
                  <TableCell align="center">
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
