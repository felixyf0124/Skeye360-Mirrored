import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import SideDrawer from '../components/SideDrawer';

interface StateProps {

}
interface DispatchProps{
    
}
class IntersectionList extends React.Component<StateProps & DispatchProps> {
    public render(): JSX.Element{
        return (
            <div>
                <SideDrawer />
            </div>
        )
    }
}

export default IntersectionList;