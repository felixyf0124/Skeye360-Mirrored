
export const selectToggle = toggle =>{
    //return an action
    return{
        type: 'TOGGLE_SELECTED',
        payload: toggle
    };

};

export default selectToggle;