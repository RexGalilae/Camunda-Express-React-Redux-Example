import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom'

import formValidate from '../helpers/formValidator.js'

import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { logUserIn } from '../store/user'

export class Login extends Component {
	state = {
		formData: {
			email: '',
			password: '',
		},
		errors: {
			// email: '',
			// password: '',
		},
		loginFailed: false,
	}

	handleFormInput = (e) => {
		const { name, value } = e.currentTarget
		const tempState = { ...this.state }
		if (formValidate(name, value))
			tempState.errors[name] = formValidate(name, value)
		else delete tempState.errors[name]

		tempState.formData[name] = value
		this.setState(tempState)
	}

	isFormReadyToSubmit = () =>
		this.state.formData.email &&
		this.state.formData.password &&
		Object.keys(this.state.errors).length === 0 &&
		this.state.errors.constructor === Object

	handleFormSubmit = async (e) => {
		e.preventDefault()

		try {
			await this.props.logIn(this.state.formData)
		} catch (error) {
			this.props.authenticationFailed = true
		}

		this.props.isLoggedIn &&
			this.props.currentTask === 'UploadFiles' &&
			this.props.history.push('/upload')

		this.props.isLoggedIn &&
			this.props.currentTask === 'Review' &&
			this.props.history.push('/review')
	}

	render() {
		return (
			<Grid textAlign="center" style={{ height: '100vh' }}>
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as="h2" color="teal" textAlign="center">
						Log-in
					</Header>
					<Form size="large">
						<Segment stacked>
							<Form.Input
								fluid
								icon="user"
								iconPosition="left"
								name="email"
								placeholder="E-mail address"
								onChange={(e) => this.handleFormInput(e)}
								error={
									this.state.errors.email
										? {
												content: this.state.errors.email,
												pointing: 'below',
										  }
										: false
								}
							/>
							<Form.Input
								fluid
								icon="lock"
								iconPosition="left"
								name="password"
								placeholder="Password"
								type="password"
								onChange={(e) => this.handleFormInput(e)}
								error={
									this.state.errors.password
										? {
												content: this.state.errors.password,
												pointing: 'below',
										  }
										: false
								}
							/>

							<Message
								error
								visible={this.props.authenticationFailed}
								header="Your email and password are incorrect. Please try again!"
							/>

							<Button
								color="teal"
								fluid
								size="large"
								disabled={!this.isFormReadyToSubmit()}
								onClick={(e) => this.handleFormSubmit(e)}
							>
								Login
							</Button>
						</Segment>
					</Form>
					<Message>
						New to us? <Link to="/signup">Sign Up</Link>
					</Message>
				</Grid.Column>
			</Grid>
		)
	}
}

const mapStateToProps = (state) => ({
	authenticationFailed: state.user.authenticationFailed,
	isLoggedIn: state.user.isLoggedIn,
	currentTask: state.user.data.taskDefinitionKey,
})

const mapDispatchToProps = (dispatch) => ({
	logIn: (user) => dispatch(logUserIn(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
