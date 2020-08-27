import pkg from '@reduxjs/toolkit'
const { createSlice } = pkg

const { actions, reducer } = createSlice({
	name: 'user',
	initialState: { data: {}, loading: false, lastFetch: null },
	reducers: {
		dataRequested: (state, action) => {
			state.loading = true
		},

		dataRequestFailed: (state, action) => {
			state.loading = false
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
	},
})

export default reducer

export const {
	dataReceieved,
	dataRequested,
	dataRequestFailed,
	userCreated,
	userUploadedFiles,
} = actions

export const createAccount = (user) => {
	apiCallBegan({
		url: 'signup',
		method: 'post',
		data: user,
		onStart: dataRequested.type,
		onSuccess: userCreated.type,
		onError: dataRequestFailed.type,
	})
}
