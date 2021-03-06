/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import LaunchIcon from '@material-ui/icons/Launch';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { setDistrictCoord, SetCoordAction } from '../contexts/app';
import { STATE as districtState } from '../contexts/districts';
import DeleteIntersectionButton from './DeleteIntersectionButton';
import TrafficIntensity from './TrafficIntensity';
import CameraConnectionStatus from './CameraConnectionStatus';
import { Response as cameraResponse } from '../api/camera';
import { MOBILE_DEVICE_MAX_WIDTH } from '../css/custom';

// Content Container
const Content = styled.div`
  margin-right: 1rem;
`;

// Generic flexboxes styling
const VerticalFlexBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: stretch;
  align-content: stretch;
`;

// Generic flexboxes styling
const TableTitle = styled.div`
  justify-content: center;
  @media only screen and (max-width: ${MOBILE_DEVICE_MAX_WIDTH}px) {
    & {
      justify-content: center;
    }
  }
`;

// Hyperlink Bold
const BoldLink = styled.a`
  font-weight: bold;
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

interface Props {
  districts: districtState;
  districtName: string;
  isStaff: boolean;
  user_id: number;
  defaultDistrictLat: number;
  defaultDistrictLng: number;
  districtLat: number;
  districtLng: number;
  selectedIntersection: string;
}

interface DispatchProps {
  setDistrictCoord: (
    selectedIntersection: string,
    lat: number,
    lng: number,
    zoom: number,
  ) => SetCoordAction;
}

export const filterList = (
  isStaff: boolean,
  user_id: number,
  assigned_user_id: number,
): boolean => {
  if (isStaff) {
    return true;
  }
  if (user_id === assigned_user_id) {
    return true;
  }
  return false;
};

const IntersectionTable = (props: Props & DispatchProps): JSX.Element => {
  // Intersection Table that retrieves all of the intersections of a district
  // And displays their information in the table.
  const classes = useStyles();
  const {
    districts, districtName, isStaff, user_id, selectedIntersection,
  } = props;
  const isMobile = useMediaQuery(`(max-width:${MOBILE_DEVICE_MAX_WIDTH}px)`);

  const intersectionOnClick = (selectedIntersection: string, lat: number, lng: number): void => {
    const {
      defaultDistrictLat,
      defaultDistrictLng,
      districtLat,
      districtLng,
      setDistrictCoord,
    } = props;
    if (districtLat !== lat && districtLng !== lng) {
      setDistrictCoord(selectedIntersection, lat, lng, 15);
    } else {
      setDistrictCoord('none', defaultDistrictLat, defaultDistrictLng, 11);
    }
  };

  return (
    <Content>
      <main className={classes.content}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="intersection table">
            <TableHead>
              <TableRow>
                {isMobile ? (
                  <TableCell align="left" colSpan={10} style={{ fontSize: '20px' }}>
                    <TableTitle>{`Intersection List: ${districts[districtName].district_name}`}</TableTitle>
                  </TableCell>
                ) : (
                  <TableCell align="center" colSpan={10} style={{ fontSize: '20px' }}>
                    <TableTitle>{`Intersection List: ${districts[districtName].district_name}`}</TableTitle>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <TableCell align="center">Intersection Name</TableCell>
                <TableCell align="center">Cameras</TableCell>
                <TableCell align="center">Traffic Intensity</TableCell>
                <TableCell align="center">Camera Status</TableCell>
                {isStaff ? <TableCell align="center">Edit</TableCell> : <div />}
                {isStaff ? <TableCell align="center">Delete</TableCell> : <div />}
              </TableRow>
            </TableHead>
            <TableBody>
              {districts[districtName] === undefined ? (
                <TableRow>
                  <TableCell component="th" scope="row" />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              ) : (
                // eslint-disable-next-line max-len
                districts[districtName].intersections.map((intersection) => (filterList(isStaff, user_id, intersection.user_id) ? (
                  <TableRow key={intersection.id}>
                    <TableCell component="th" scope="row" align="center">
                      {selectedIntersection === intersection.intersection_name ? (
                        <BoldLink
                          href="/#"
                          onClick={(): void => intersectionOnClick(
                            intersection.intersection_name,
                            intersection.latitude,
                            intersection.longitude,
                          )}
                        >
                          {intersection.intersection_name}
                        </BoldLink>
                      ) : (
                        <a
                          href="/#"
                          onClick={(): void => intersectionOnClick(
                            intersection.intersection_name,
                            intersection.latitude,
                            intersection.longitude,
                          )}
                        >
                          {intersection.intersection_name}
                        </a>
                      )}
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
                        <TrafficIntensity
                          key={camera.id}
                          camera_id={camera.id}
                          camera_url={camera.camera_url}
                        />
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      {intersection.cameras.map((camera: cameraResponse) => (
                        <CameraConnectionStatus key={camera.id} camera_id={camera.id} />
                      ))}
                    </TableCell>
                    {isStaff ? (
                      <TableCell align="center">
                        <Link to={`/intersection/edit/${intersection.id}`}>
                          <EditIcon />
                        </Link>
                      </TableCell>
                    ) : (
                      <div />
                    )}
                    {isStaff ? (
                      <TableCell align="center">
                        <DeleteIntersectionButton intersection_id={intersection.id} />
                      </TableCell>
                    ) : (
                      <div />
                    )}
                  </TableRow>
                ) : (
                  <div />
                )))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </Content>
  );
};

const mapDispatchToProps: DispatchProps = {
  setDistrictCoord,
};

export default connect(null, mapDispatchToProps)(IntersectionTable);
