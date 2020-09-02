export const SET_BETS = 'SET_BETS'
export const ADD_BETS = 'ADD_BETS'

export const initBets = (payload) => {
	return { type: SET_BETS, payload }
};

export const addBets = (payload) => {
	return { type: ADD_BETS, payload }
};
