import { createSlice } from '@reduxjs/toolkit'
import { apiCallBegan } from './api'
import moment from 'moment'

const { actions, reducer } = createSlice({
	name: 'dropdowns',
	initialState: {
		cities: [],
		visas: [],
		loading: false,
		lastFetch: null,
	},

	reducers: {
		dataRequested: (state, action) => {
			state.loading = true
		},
		dataRequestFailed: (state, action) => {
			state.loading = false
		},
		citiesReceived: (state, action) => {
			state.cities = action.payload
			state.loading = false
			state.lastFetch = Date.now()
		},
		visasReceived: (state, action) => {
			state.visas = action.payload
			state.loading = false
			state.lastFetch = Date.now()
		},
	},
})

export default reducer

const {
	citiesReceived,
	visasReceived,
	dataRequestFailed,
	dataRequested,
} = actions

export const loadCities = (id = '') => (dispatch, getState) => {
	const { lastFetch } = getState().statics
	const diffInMinutes = moment().diff(moment(lastFetch), 'minutes')

	if (diffInMinutes < 60) return

	return dispatch(
		apiCallBegan({
			url: 'cities/' + id,
			onStart: dataRequested.type,
			onSuccess: citiesReceived.type,
			onError: dataRequestFailed.type,
		})
	)
}

export const loadVisas = (id = '') => (dispatch, getState) => {
	const { lastFetch } = getState().statics
	const diffInMinutes = moment().diff(moment(lastFetch), 'minutes')

	if (diffInMinutes < 60) return

	return dispatch(
		apiCallBegan({
			url: 'visas/' + id,
			onStart: dataRequested.type,
			onSuccess: visasReceived.type,
			onError: dataRequestFailed.type,
		})
	)
}
