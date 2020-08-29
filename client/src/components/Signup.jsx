import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadCities, loadVisas } from '../store/statics.js'
import { createAccount } from '../store/user.js'

import formValidate from '../helpers/formValidator.js'

import { Link } from 'react-router-dom'

import {
	Button,
	Container,
	Form,
	Grid,
	Segment,
	Header,
	Message,
	Divider,
} from 'semantic-ui-react'

export class Signup extends Component {
	state = {
		formData: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			city: '',
			visa: '',
		},
		errors: {
			// firstName: '',
			// lastName: '',
			// email: '',
			// password: '',
		},
	}

	componentDidMount() {
		this.props.loadCities()
		this.props.loadVisas()
	}

	prepDropdownData = () => {
		const { cities, visas } = this.props.statics

		const cityData = cities.map((city) => ({
			key: city.code,
			text: city.name,
			value: city._id,
		}))

		const visaData = visas.map((visa) => ({
			key: visa._id,
			text: visa.name,
			value: visa._id,
		}))

		return {
			cityData,
			visaData,
		}
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
		this.state.formData.firstName &&
		this.state.formData.lastName &&
		this.state.formData.email &&
		this.state.formData.password &&
		this.state.formData.city &&
		this.state.formData.visa &&
		Object.keys(this.state.errors).length === 0 &&
		this.state.errors.constructor === Object

	handleFormSubmit = async (e) => {
		e.preventDefault()

		try {
			await this.props.createAccount(this.state.formData)
		} catch (error) {
			console.log(error)
		}

		this.props.history.push('/login')
	}

	render() {
		return (
			<div>
				<Container>
					<Grid textAlign="center" style={{ height: '100vh' }} padded>
						<Grid.Column style={{ maxWidth: 450 }}>
							<Header as="h2" color="teal" textAlign="center">
								Sign-Up
							</Header>
							<Form size="large">
								<Segment stacked>
									<Form.Input
										fluid
										icon="user"
										iconPosition="left"
										name="firstName"
										placeholder="First Name"
										onChange={(e) => this.handleFormInput(e)}
										error={
											this.state.errors.firstName
												? {
														content: this.state.errors.firstName,
														pointing: 'below',
												  }
												: false
										}
									/>
									<Form.Input
										fluid
										icon="user"
										iconPosition="left"
										name="lastName"
										placeholder="Last Name"
										onChange={(e) => this.handleFormInput(e)}
										error={
											this.state.errors.lastName
												? {
														content: this.state.errors.lastName,
														pointing: 'below',
												  }
												: false
										}
									/>
									<Divider hidden />
									<Form.Input
										fluid
										icon="mail"
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
									<Divider hidden />

									<Form.Field>
										<select
											name="city"
											id="city"
											className="form-control"
											onChange={(e) => {
												this.handleFormInput(e)
											}}
										>
											<option value={null}>Select your City</option>
											{this.props.statics.cities.map((city) => (
												<option key={city._id} value={city._id}>
													{city.name}
												</option>
											))}
										</select>
									</Form.Field>
									<Form.Field>
										<select
											name="visa"
											id="visa"
											className="form-control"
											onChange={(e) => {
												this.handleFormInput(e)
											}}
										>
											<option value={null}>Select a Visa Type</option>
											{this.props.statics.visas.map((visa) => (
												<option key={visa._id} value={visa._id}>
													{visa.name}
												</option>
											))}
										</select>
									</Form.Field>

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
								Already Regsitered? <Link to="/login">Sign In</Link>
							</Message>
						</Grid.Column>
					</Grid>
				</Container>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	statics: state.statics,
})

const mapDispatchToProps = (dispatch) => ({
	loadCities: () => dispatch(loadCities()),
	loadVisas: () => dispatch(loadVisas()),
	createAccount: (user) => dispatch(createAccount(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
