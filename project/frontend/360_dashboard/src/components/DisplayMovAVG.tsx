import React from 'react';
import { getCount, GetCountAction } from '../contexts/countTime';
import SideDrawer from './SideDrawer';
import { Response as CountResponse } from '../api/countTime';
import { RootState } from '../reducers/rootReducer';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

interface StateProps {
    counts: CountResponse;
}

interface DispatchProps {
    getCount(): GetCountAction;
    historyPush: (url: string) => void;
}
class DisplayCount extends React.Component<StateProps & DispatchProps> {
    public componentDidMount(): void {
        getCount();
    }
   public render(): JSX.Element {
    const { getCount } = this.props;
    getCount();

    console.log(getCount);
        return(
            <div style={{margin: '50vh', backgroundColor: 'pink'}}>
                H-HEWWO???? uwu
            </div>
        )
    }
}

const mapStateToProps = (state: RootState): StateProps => ({
    ...state,
    counts: state.countTime,
});

const mapDispatchToProps: DispatchProps = {
    getCount,
    historyPush: push,
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayCount);