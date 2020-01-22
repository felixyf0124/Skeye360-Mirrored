import React from 'react';
//import { STATE as countState, getCount, GetCountAction, } from '../contexts/countTime';

import { RootState } from '../reducers/rootReducer';
import { connect } from 'react-redux';

import { getCountMAvg, GetCountMAvgAction } from '../contexts/countTime';
import { STATE as countState } from '../contexts/countTime';

interface StateProps {
  countAvg: countState;
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
});

const mapDispatchToProps: DispatchProps = {
  getCountMAvg,
};


function getCountsLastYr(){
  //var lastYear: CountResponse[] = [];
  var today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDay = today.getDate();

  const lastYear = currentYear - 1;
  var lastYrDate = new Date(currentYear,currentMonth,currentDay);
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayCount);