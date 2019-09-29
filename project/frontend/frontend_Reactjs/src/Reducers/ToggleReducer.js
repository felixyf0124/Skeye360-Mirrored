import { combineReducers } from "redux";


const toggleReducer = () => {
    return [
        { id: '666', name: 'myToggle', toggle_state: 'ON', group_name:'Capstone Milestone 1', date_created: '2019-08-08', date_modified:''},
        { id: '667', name: 'myToggle2', toggle_state: 'OFF', group_name:'Capstone Milestone 1', date_created: '2019-08-09', date_modified:''}
    ]
};

const selectedToggleReducer = (selectedToggle=null,action) => {
    if (action.type === 'TOGGLE_SELECTED') {
        return action.payload;
    }
    return selectedToggle;
};

export default combineReducers({
    toggles: toggleReducer,
    selectedToggle: selectedToggleReducer
});