/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
import React from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { RootState } from '../reducers/rootReducer';
import MovingAvgChart from './MovingAvgChart';
import splitIntoTwo from './graphFunction';

interface Props {
  intersection_id: string;
}

interface StateProps {
  error: any;
  isLoaded: boolean;
  dataNS: any;
}

const { REACT_APP_API_URL } = process.env;
const APIDomain = REACT_APP_API_URL;

// Function that performs the GET Request to retrieve the car count of a specific direction.
// change to any direcitons
export const getCountMAvgNS = async (intersection_id: string): Promise<Response> => {
  const url = `//${APIDomain}/api/count/?intersection_id=${intersection_id}&count_type=arima&count_direction=ns`;
  const settings = {
    method: 'GET',
    headers: {},
  };
  const response = await fetch(url, settings);
  const data = (await response.json()) as Response;
  return data;
};

// Function that generates the exact date last year to retrieve based on today's date as well as the day after it.
function getDateLastYear() {
  // create a new date object based on today and convert to ISO string
  const today = new Date();
  const todayToISO = today.toISOString();

  // Retrieve the year, month, day
  const thisYear = parseInt(todayToISO.substring(0, 4), 10);
  const thisMonth = parseInt(todayToISO.substring(5, 7), 10);
  const thisDate = parseInt(todayToISO.substring(8, 10), 10);

  // Create a date object last year based on today and create one for the next day
  const lastYearDate = new Date(thisYear - 1, thisMonth - 1, thisDate);
  const lastYearNextDay = new Date(thisYear - 1, thisMonth - 1, thisDate + 1);

  // Convert the dates to ISO
  const lastYearToISO = lastYearDate.toISOString();
  const lastYearNextDayToISO = lastYearNextDay.toISOString();

  // Retrieve the date string in the YYYY/MM/DD format
  const getLastYearDateFormat = lastYearToISO.substring(0, 10);
  const getLastYearNextDayFormat = lastYearNextDayToISO.substring(0, 10);

  return [getLastYearDateFormat, getLastYearNextDayFormat];
}

const datesLastYear = getDateLastYear();
const date1 = datesLastYear[0];
const date2 = datesLastYear[1];

/* Function that retrieves specific key-pair value of data:
  Input: array of different time entries for a specific direction.
  Output: Array of key-pair values for time and count which will be passed to the moving average graph. */

class DisplayCount extends React.Component<{} & Props, StateProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      dataNS: null,
    };
  }

  public componentDidMount(): void {
    const { intersection_id } = this.props;
    getCountMAvgNS(intersection_id).then((data: any) => {
      this.setState({
        isLoaded: true,
        dataNS: splitIntoTwo(data),
      });
    });
  }

  public render(): JSX.Element {
    const { isLoaded, dataNS, error } = this.state;

    if (!isLoaded) {
      return <CircularProgress />;
    }
    if (error) {
      return <h1>Error</h1>;
    }
    return <MovingAvgChart values={dataNS} />;
  }
}

const mapStateToProps = (state: RootState): Props => ({
  intersection_id: state.router.location.pathname.substring(
    state.router.location.pathname.lastIndexOf('/') + 1,
  ),
});

export default connect(mapStateToProps)(DisplayCount);
