import React from 'react'
import './App.css'
import configureStore from './store/store'
import { Provider } from 'react-redux'
import Signup from './components/Signup'
import {} from 'semantic-ui-react'

const store = configureStore()

function App() {
	return (
		<Provider store={store}>
			<Signup />
		</Provider>
	)
}

export default App
