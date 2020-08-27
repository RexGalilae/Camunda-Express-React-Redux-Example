import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import reducer from './user.js'
import api from './middleware/api.js'

export default () => {
	const store = configureStore({
		reducer,
		middleware: [...getDefaultMiddleware(), api],
	})
	return store
}
