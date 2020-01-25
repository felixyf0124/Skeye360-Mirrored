import React from 'react';
import { RootState } from '../reducers/rootReducer';
import { connect } from 'react-redux';
import { getCountMAvg, GetCountMAvgAction } from '../contexts/countTime';
import { STATE as countState } from '../contexts/countTime';

interface StateProps {
  countAvg: countState;
  intersection_id: string;
}
interface DispatchProps {
  getCountMAvg(id: string): GetCountMAvgAction;
}
class DisplayCount extends React.Component<StateProps & DispatchProps> {
  public componentDidMount(): void {
    const { getCountMAvg, intersection_id } = this.props;
    getCountMAvg(intersection_id); //this is what calls the GET request
  }

  public render(): JSX.Element {
    const { intersection_id } = this.props;
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
  )
});

const mapDispatchToProps: DispatchProps = {
  getCountMAvg,
};

//Function that generates the exact date last year to retrieve based on today's date
//This gets saved into a STATE that will be passed to the GET Request.
function getDateLastYear(){
  //Create a new date, today
  var today = new Date();
  //Convert to ISO
  const todayToISO = today.toISOString();
  //Retrieve the current year
  var thisYear = todayToISO.substring(0,3);
  var thisYearInt = parseInt(thisYear);
  const lastYear = thisYearInt - 1;
  const lastYearString = lastYear.toString();

  //Retrieve the date (month and day)
  var monthDay = todayToISO.substring(4,9);
  var lastYearDate = lastYearString + monthDay; 

  return lastYearDate; 
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
function mapIntoNS(counts: countState[]){
  const x: any[] = [];
  const y: number[] = [];
  counts.map((count)=> {
    if(count.count_direction === 'NS'){
      x.push(count.time);
      y.push(count.count);
    }
  });
  return [x,y];
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