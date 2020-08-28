import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

export class Review extends Component {
	render() {
		return (
			<div>
				{this.props.isLoggedIn ? (
					<h1>Review Page!</h1>
				) : (
					<Redirect to="/login" />
				)}
			</div>
		)
	}
}

const mapStateToProps = ({ user }) => ({
	isLoggedIn: user.isLoggedIn,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Review)
