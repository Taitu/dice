import { SET_BETS, ADD_BETS} from '../actions/bets';

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_BETS:
      return action.payload

    case ADD_BETS:
      let bets = [...action.payload, ...state]
      if (bets.length > 100) {
        bets.splice(100, bets.length - 1)
      }
      return bets

    default:
      return state;
  }
}