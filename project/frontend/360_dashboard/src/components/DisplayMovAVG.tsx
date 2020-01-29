/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
import React from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { RootState } from '../reducers/rootReducer';
import MovingAvgChart from './MovingAvgChart';

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
function splitIntoTwo(values: any) {
  const data1x = [];
  const data1y = [];
  let i;
  let j;
  /* eslint-disable no-plusplus */
  /* eslint-disable radix */
  for (i = 0; i < values.length; i++) {
    data1x.push(parseInt(values[i].time.substring(11, 13)));
  }
  for (j = 0; j < values.length; j++) {
    data1y.push(parseInt(values[j].count));
  }
  return [[data1x[0], data1y[0]], [data1x[1], data1y[1]], [data1x[2], data1y[2]], [data1x[3], data1y[3]], [data1x[4], data1y[4]],
    [data1x[5], data1y[5]], [data1x[6], data1y[6]], [data1x[7], data1y[7]], [data1x[8], data1y[8]], [data1x[9], data1y[9]],
    [data1x[10], data1y[10]], [data1x[11], data1y[11]], [data1x[12], data1y[12]], [data1x[13], data1y[13]], [data1x[14], data1y[14]],
    [data1x[15], data1y[15]], [data1x[16], data1y[16]], [data1x[17], data1y[17]], [data1x[18], data1y[18]], [data1x[19], data1y[19]],
    [data1x[20], data1y[20]], [data1x[21], data1y[21]], [data1x[22], data1y[22]], [data1x[23], data1y[23]]];
}

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
    getCountMAvgNS(intersection_id)
      .then(
        (data: any) => {
          this.setState({
            isLoaded: true,
            dataNS: splitIntoTwo(data),
          });
        },
      );
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
