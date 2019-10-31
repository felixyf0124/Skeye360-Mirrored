import React from 'react';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import LineChart from '../components/LineChart';
import MixedChart from '../components/MixedChart';
import Header from '../components/Header';
import { Redirect } from 'react-router-dom';
import { RootState } from '../reducers/rootReducer';
import { connect } from 'react-redux';


interface Props {
    authenticated: boolean; 
}

const ChartsPrototype = ({ authenticated }: Props): JSX.Element => {
    if (!authenticated) return <Redirect push to={'/login'} />;

    return(
        <div>
        <Header />
        <div className="charts-prototype">
            <h1 className="charts-header">Chart Prototypes</h1>
            <div className="charts-row">
                <LineChart />
                <MixedChart />
            </div>
            <div className="charts-row">
                <PieChart />
                <BarChart />
            </div>
        </div>
        </div>
    )
}

const mapStateToProps = (state: RootState): Props => ({
    authenticated: state.authentication.authenticated,
  });
  

export default connect(
     mapStateToProps,
)(ChartsPrototype);