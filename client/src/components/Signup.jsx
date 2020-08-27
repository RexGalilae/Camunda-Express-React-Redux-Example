import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadCities, loadVisas } from '../store/statics.js'

export class Signup extends Component {
	componentDidMount() {
		this.props.loadCities()
		this.props.loadVisas()
	}
	render() {
		return <div></div>
	}
}

const mapStateToProps = (state) => ({
	statics: state.statics,
})

const mapDispatchToProps = (dispatch) => ({
	loadCities: () => dispatch(loadCities()),
	loadVisas: () => dispatch(loadVisas()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
