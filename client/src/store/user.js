import { createSlice } from '@reduxjs/toolkit'
import { apiCallBegan } from './api'

const { actions, reducer } = createSlice({
	name: 'user',
	initialState: {
		data: {},
		loading: false,
		lastFetch: null,
		isLoggedIn: false,
		authenticationFailed: false,
	},
	reducers: {
		dataRequested: (state, action) => {
			state.loading = true
		},

		dataRequestFailed: (state, action) => {
			state.loading = false
			console.log(action.payload)
		},

		dataReceieved: (state, action) => {
			state.data = action.payload
			state.loading = false
			state.lastFetch = Date.now()
		},

		userCreated: (state, action) => {
			state.data = action.payload
		},

		userUploadedFiles: (state, action) => {
			state.data.passportUploaded = true
			state.data.eidUploaded = true
		},

		userLoggedIn: (state, action) => {
			state.loading = false
			state.data = action.payload
			state.isLoggedIn = true
			state.authenticationFailed = false
		},

		authenticationFailed: (state, action) => {
			state.loading = false
			state.authenticationFailed = true
		},

		userLoggedOut: (state, action) => {
			state.data = {}
			state.isLoggedIn = false
		},
	},
})

export default reducer

const {
	dataReceieved,
	dataRequested,
	dataRequestFailed,
	userCreated,
	userUploadedFiles,
	userLoggedIn,
	authenticationFailed,
	userLoggedOut,
} = actions

export const createAccount = (user) =>
	apiCallBegan({
		url: 'signup',
		method: 'post',
		data: user,
		onStart: dataRequested.type,
		onSuccess: userCreated.type,
		onError: dataRequestFailed.type,
	})

export const logUserIn = (user) =>
	apiCallBegan({
		url: 'login',
		method: 'post',
		data: user,
		onStart: dataRequested.type,
		onSuccess: userLoggedIn.type,
		onError: authenticationFailed.type,
	})

export const uploadUserFiles = () => (dispatch, getState) =>
	dispatch(
		apiCallBegan({
			url: 'upload',
			method: 'post',
			data: { email: getState().user.data.email },
			onStart: dataRequested.type,
			onSuccess: userUploadedFiles.type,
			onError: dataRequestFailed.type,
		})
	)

export const getUserDeets = () => (dispatch, getState) =>
	!getState().user.data.email
		? null
		: dispatch(
				apiCallBegan({
					url: 'profile',
					method: 'post',
					data: { email: getState().user.data.email },
					onStart: dataRequested.type,
					onSuccess: dataReceieved.type,
					onError: dataRequestFailed.type,
				})
		  )

export const logUserOut = () => userLoggedOut()
