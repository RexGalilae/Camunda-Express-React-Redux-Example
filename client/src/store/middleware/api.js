import axios from 'axios'
import * as actions from '../api.js'

const api = ({ dispatch }) => (next) => async (action) => {
	if (action.type !== actions.apiCallBegan.type) return next(action)

	const { url, method, data, onStart, onSuccess, onError } = action.payload

	if (onStart) dispatch({ type: onStart })

	next(action)

	try {
		const res = await axios.request({
			baseURL: 'http://localhost:8000/api',
			url,
			method,
			data,
		})

		dispatch(actions.apiCallSuccess({ ...data, ...res.data }))

		if (onSuccess) dispatch({ type: onSuccess, payload: res.data })
	} catch (error) {
		dispatch(actions.apiCallFailed(error.message))

		if (onError) dispatch({ type: onError, payload: error.message })
	}
}
export default api
