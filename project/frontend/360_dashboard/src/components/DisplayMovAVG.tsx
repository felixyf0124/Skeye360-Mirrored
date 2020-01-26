import React from 'react';
import { RootState } from '../reducers/rootReducer';
import { connect } from 'react-redux';
import { getCountMAvg, GetCountMAvgAction } from '../contexts/countTime';
import { STATE as countState } from '../contexts/countTime';
import { Response as countResponse } from '../api/countTime';

interface StateProps {
  countAvg: countResponse;
  intersection_id: string;
  dateLastYear: string;
  dateTomorrowLastYear: string;
}
interface DispatchProps {
  getCountMAvg(id: string, dateLastYear: string, dateTomorrowLastYear: string): GetCountMAvgAction;
}

const datesLastYear = getDateLastYear();
const date1 = datesLastYear[0];
const date2 = datesLastYear[1];

class DisplayCount extends React.Component<StateProps & DispatchProps> {
  
  public componentDidMount(): void {  
    
    const { getCountMAvg, intersection_id } = this.props;
    getCountMAvg(intersection_id, date1, date2); //this is what calls the GET request
  }
  public render(): JSX.Element {
    const { countAvg } = this.props;
    const directions = mapByDirection(countAvg);
    //console.log(directions[1]);

    return(
      <div style={{margin: '50vh', color: 'pink'}}>
      </div>
    )
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

//Function that generates the exact date last year to retrieve based on today's date as well as the day after it
//This gets saved into a STATE that will be passed to the GET Request to retrieve all of the count in an intersection of a particular date.
function getDateLastYear(){
  //create a new date object based on today and convert to ISO string
  const today = new Date();
  const todayToISO = today.toISOString();

  //Retrieve the year, month, day
  const thisYear = parseInt(todayToISO.substring(0,4));
  const thisMonth = parseInt(todayToISO.substring(5,7));
  const thisDate = parseInt(todayToISO.substring(8,10));

  //Create a date object last year based on today and create one for the next day
  const lastYearDate = new Date(thisYear-1,thisMonth-1,thisDate);
  const lastYearNextDay = new Date(thisYear-1,thisMonth-1,thisDate+1);

  //Convert the dates to ISO
  const lastYearToISO = lastYearDate.toISOString();
  const lastYearNextDayToISO = lastYearNextDay.toISOString();

  //Retrieve the date string in the YYYY/MM/DD format 
  const getLastYearDateFormat = lastYearToISO.substring(0,10);
  const getLastYearNextDayFormat = lastYearNextDayToISO.substring(0,10);

  return [getLastYearDateFormat, getLastYearNextDayFormat];
}

//Function that retrieves time strings and associates them with an hour of the day
function mapHours(times: string[]){
  const newX: any[] = [];
  var currentTime;
  var timeToInt;
  times.map((time) => {
    currentTime = time.substring(11,12);
    timeToInt = parseInt(currentTime);
    newX.push(time)
  });
}

//Function that places every count response in a different array based on its direction
function mapByDirection(counts: countResponse){
  const xns: any[] = [];
  const yns: number[] = [];

  const xsn: any[] = [];
  const ysn: number[] = [];

  const xen: any[] = [];
  const yen: number[] = [];
  
  const xes: any[] = [];
  const yes: number[] = [];

  const xew: any[] = [];
  const yew: number[] = [];

  const xne: any[] = [];
  const yne: number[] = [];

  const xnw: any[] = [];
  const ynw: number[] = [];

  const xse: any[] = [];
  const yse: number[] = [];

  const xsw: any[] = [];
  const ysw: number[] = [];

  const xwe: any[] = [];
  const ywe: number[] = [];

  const xwn: any[] = [];
  const ywn: number[] = [];

  const xws: any[] = [];
  const yws: number[] = [];

  Object.values(counts).forEach(value => {
    if(value.count_direction === 'ns'){
      xns.push(value.time);
      yns.push(value.count);
    }
    if(value.count_direction === 'sn'){
      xsn.push(value.time);
      ysn.push(value.count);
    }
    if(value.count_direction === 'en'){
      xen.push(value.time);
      yen.push(value.count);
    }
    if(value.count_direction === 'es'){
      xes.push(value.time);
      yes.push(value.count);
    }
    if(value.count_direction === 'ew'){
      xew.push(value.time);
      yew.push(value.count);
    }
    if(value.count_direction === 'ne'){
      xne.push(value.time);
      yne.push(value.count);
    }
    if(value.count_direction === 'nw'){
      xnw.push(value.time);
      ynw.push(value.count);
    }
    if(value.count_direction === 'se'){
      xse.push(value.time);
      yse.push(value.count);
    }
    if(value.count_direction === 'sw'){
      xsw.push(value.time);
      ysw.push(value.count);
    }
    if(value.count_direction === 'we'){
      xwe.push(value.time);
      ywe.push(value.count);
    }
    if(value.count_direction === 'wn'){
      xwn.push(value.time);
      ywn.push(value.count);
    }
    if(value.count_direction === 'ws'){
      xws.push(value.time);
      yws.push(value.count);
    }
  }); 
  
  return [
    {xns, yns},
    {xsn, ysn},
    {xen, yen},
    {xes, yes},
    {xew, yew},
    {xne, yne},
    {xnw, ynw},
    {xse, yse},
    {xsw, ysw},
    {xwe, ywe},
    {xwn, ywn},
    {xws, yws}
  ];
}

//Function that sorts count responses based on time, interval of 24 hours
//Sorting from smallest to largest
//Sort from key-value pairs
//https://stackoverflow.com/questions/14208651/javascript-sort-key-value-pair-object-based-on-value
//https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
function mapIntoKeyPairValues(counts: countState[]){
  var keyValuePairArray: any[] = [];
  var keyTimes: any[] = [];
  var sortedPair: any[] = [];

  //iterate through the count responses to create an array with key-pair values that are time and counts respectively
  //Obtain the specific hour in the time and use it as the key
  counts.map((count) =>{
    keyValuePairArray.push({
      key: parseInt(count.time.substring(11,12)),
      value: count.count,
    });
    //push the keys in another array for sorting purposes
    keyTimes.push(parseInt(count.time.substring(11,12)));
  });

  //sort the keys
  keyTimes.sort();

  //sort the key-value array based on the sorted keys array
  keyTimes.map((keyTime) => {
    sortedPair.push(keyValuePairArray[keyTime]);
  });
  return sortedPair;
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayCount);