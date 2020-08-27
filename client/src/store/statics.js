import { createSlice } from '@reduxjs/toolkit'
import { apiCallBegan } from './api'

const { actions, reducer } = createSlice({
	name: 'dropdowns',
	initialState: {
		cities: [],
		visas: [],
	},

	reducers: {
		citiesReceived: (state, action) => {
			state.cities = action.payload
		},
		visasReceived: (state, action) => {
			state.visas = action.payload
		},
	},
})

export default reducer

const { citiesReceived, visasReceived } = actions

export const loadCities = () => (dispatch, getState) => {
	return dispatch(
		apiCallBegan({
			url: 'cities',
			onSuccess: citiesReceived.type,
		})
	)
}

export const loadVisas = () => (dispatch, getState) => {
	return dispatch(
		apiCallBegan({
			url: 'visas',
			onSuccess: visasReceived.type,
		})
	)
}
