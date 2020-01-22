import React from 'react';
//import { STATE as countState, getCount, GetCountAction, } from '../contexts/countTime';

import { RootState } from '../reducers/rootReducer';
import { connect } from 'react-redux';

import { getCountMAvg, GetCountMAvgAction } from '../contexts/countTime';
import { STATE as countState } from '../contexts/countTime';

interface StateProps {
  countAvg: countState;
  intersection_id: string;

}
interface SomeProps{
 // intersection_id: string;
}
interface DispatchProps {
  getCountMAvg(): GetCountMAvgAction;
}
class DisplayCount extends React.Component<StateProps & DispatchProps> {
  public componentDidMount(): void {
    const { getCountMAvg } = this.props;
    getCountMAvg(); //this is what calls the GET request
  }
  

  public render(): JSX.Element {

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


export default connect(mapStateToProps, mapDispatchToProps)(DisplayCount);;