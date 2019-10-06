// eslint-disable-next-line import/prefer-default-export
export const simpleAction = () => (dispatch: any) => {
  dispatch({
    type: 'SIMPLE_ACTION',
    payload: 'result_of_simple_action',
  });
};
