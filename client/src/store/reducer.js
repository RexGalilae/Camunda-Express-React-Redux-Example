import { combineReducers } from 'redux'
import userReducer from './user'
import staticsReducer from './statics'

export default combineReducers({
	user: userReducer,
	statics: staticsReducer,
})
