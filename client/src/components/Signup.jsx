import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadCities, loadVisas } from '../store/statics.js'
import {
	Button,
	Container,
	Form,
	Grid,
	Segment,
	Header,
	Message,
	Dropdown,
	Divider,
} from 'semantic-ui-react'

export class Signup extends Component {
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

	render() {
		return (
			<div>
				<Container>
					<Grid
						textAlign="center"
						style={{ height: '100vh' }}
						verticalAlign="middle"
						padded
					>
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
										placeholder="First Name"
									/>
									<Form.Input
										fluid
										icon="user"
										iconPosition="left"
										placeholder="Last Name"
									/>
									<Divider hidden />
									<Form.Input
										fluid
										icon="mail"
										iconPosition="left"
										placeholder="E-mail address"
									/>
									<Form.Input
										fluid
										icon="lock"
										iconPosition="left"
										placeholder="Password"
										type="password"
									/>

									<Form.Field>
										<Dropdown
											placeholder="City"
											fluid
											search
											selection
											options={this.prepDropdownData().cityData}
										/>
									</Form.Field>
									<Form.Field>
										<Dropdown
											placeholder="Visa Type"
											fluid
											search
											selection
											options={this.prepDropdownData().visaData}
										/>
									</Form.Field>

									<Button
										color="teal"
										fluid
										size="large"
										onClick={this.prepDropdownData}
									>
										Login
									</Button>
								</Segment>
							</Form>
							<Message>
								Already Regsitered? <a href="#">Sign In</a>
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
