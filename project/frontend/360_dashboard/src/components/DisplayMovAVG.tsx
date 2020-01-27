/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */ 
import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { getCountMAvg, GetCountMAvgAction } from '../contexts/countTime';
import { Response as countResponse } from '../api/countTime';
import MovingAvgChart from './MovingAvgChart';

interface StateProps {
  countAvg: countResponse;
  intersection_id: string;
  dateLastYear: string;
  dateTomorrowLastYear: string;
}
interface DispatchProps {
  getCountMAvg(id: string, dateLastYear: string, dateTomorrowLastYear: string): GetCountMAvgAction;
}
// Function that generates the exact date last year to retrieve based on today's date as well as the day after it
// This gets saved into a STATE that will be passed to the GET Request to retrieve all of the count in an intersection of a particular date.
function getDateLastYear() {
  // create a new date object based on today and convert to ISO string
  const today = new Date();
  const todayToISO = today.toISOString();

  // Retrieve the year, month, day
  const thisYear = parseInt(todayToISO.substring(0, 4));
  const thisMonth = parseInt(todayToISO.substring(5, 7));
  const thisDate = parseInt(todayToISO.substring(8, 10));

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

// Function that places every count response in a different array based on its direction
/* eslint-disable @typescript-eslint/no-array-constructor */
function mapByDirection(counts: countResponse) {
  const ns = {
    count: Array(),
    direction: 'ns',
    time: Array(),
  };
  const sn = {
    count: Array(),
    direction: 'sn',
    time: Array(),
  };
  const en = {
    count: Array(),
    direction: 'en',
    time: Array(),
  };
  const es = {
    count: Array(),
    direction: 'es',
    time: Array(),
  };
  const ew = {
    count: Array(),
    direction: 'ew',
    time: Array(),
  };
  const ne = {
    count: Array(),
    direction: 'ne',
    time: Array(),
  };
  const nw = {
    count: Array(),
    direction: 'nw',
    time: Array(),
  };
  const se = {
    count: Array(),
    direction: 'se',
    time: Array(),
  };
  const sw = {
    count: Array(),
    direction: 'sw',
    time: Array(),
  };
  const we = {
    count: Array(),
    direction: 'we',
    time: Array(),
  };
  const wn = {
    count: Array(),
    direction: 'wn',
    time: Array(),
  };
  const ws = {
    count: Array(),
    direction: 'ws',
    time: Array(),
  };

  // Iterating through the count responses
  Object.values(counts).forEach((value) => {
    switch (value.count_direction) {
      case 'ns':
        ns.count.push(value.count);
        ns.time.push(value.time.substring(11, 12));
        break;
      case 'sn':
        sn.count.push(value.count);
        sn.time.push(value.time.substring(11, 12));
        break;
      case 'en':
        en.count.push(value.count);
        en.time.push(value.time.substring(11, 12));
        break;
      case 'es':
        es.count.push(value.count);
        es.time.push(value.time.substring(11, 12));
        break;
      case 'ew':
        ew.count.push(value.count);
        ew.time.push(value.time.substring(11, 12));
        break;
      case 'ne':
        ne.count.push(value.count);
        ne.time.push(value.time.substring(11, 12));
        break;
      case 'nw':
        nw.count.push(value.count);
        nw.time.push(value.time.substring(11, 12));
        break;
      case 'se':
        se.count.push(value.count);
        se.time.push(value.time.substring(11, 12));
        break;
      case 'sw':
        sw.count.push(value.count);
        sw.time.push(value.time.substring(11, 12));
        break;
      case 'we':
        we.count.push(value.count);
        we.time.push(value.time.substring(11, 12));
        break;
      case 'wn':
        wn.count.push(value.count);
        wn.time.push(value.time.substring(11, 12));
        break;
      case 'ws':
        ws.count.push(value.count);
        ws.time.push(value.time.substring(11, 12));
        break;
    }
  });
  return [ns, sn, en, es, ew, ne, nw, se, sw, we, wn, ws];
}
class DisplayCount extends React.Component<StateProps & DispatchProps> {
  public componentDidMount(): void {
    const { getCountMAvg, intersection_id } = this.props;
    getCountMAvg(intersection_id, date1, date2); // this is what calls the GET request
  }

  public render(): JSX.Element {
    const { countAvg } = this.props;
    const directions = mapByDirection(countAvg);
    return (
      <div>
        <h1 style={{color: 'red'}}>THE CHART SHOULD BE HERE</h1>
      <MovingAvgChart values={directions} />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  countAvg: state.countTime,
  intersection_id: state.router.location.pathname.substring(
    state.router.location.pathname.lastIndexOf('/') + 1,
  ),
  dateLastYear: date1,
  dateTomorrowLastYear: date2,

});

const mapDispatchToProps: DispatchProps = {
  getCountMAvg,
};

export default connect(mapStateToProps, mapDispatchToProps)(DisplayCount);
