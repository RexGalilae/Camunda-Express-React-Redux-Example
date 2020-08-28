import React from 'react'
import './App.css'

import configureStore from './store/store'
import { Provider } from 'react-redux'

import { Switch, Route, Redirect } from 'react-router-dom'

import Signup from './components/Signup'
import NavBar from './components/NavBar'
import Login from './components/Login'
import Upload from './components/Upload'
import Review from './components/Review'

const store = configureStore()

function App() {
	return (
		<Provider store={store}>
			<NavBar />
			<Switch>
				<Route path="/signup" component={Signup} />
				<Route path="/login" component={Login} />
				<Route path="/upload" component={Upload} />
				<Route path="/review" component={Review} />
				<Redirect to="/login" />
			</Switch>
		</Provider>
	)
}

export default App
