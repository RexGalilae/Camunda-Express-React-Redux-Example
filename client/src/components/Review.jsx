import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'

import { loadCities, loadVisas } from '../store/statics.js'
import { getUserDeets } from '../store/user'

import {
	Container,
	Form,
	Grid,
	Segment,
	Header,
	Message,
	Divider,
	Icon,
	Item,
	Table,
} from 'semantic-ui-react'

export class Review extends Component {
	componentDidMount() {
		this.props.getUserDeets()
		this.props.loadCities()
		this.props.loadVisas()
	}

	render() {
		const {
			firstName,
			lastName,
			email,
			city,
			visa,
			uploadedEid,
			uploadedPassport,
		} = this.props.userData

		const cityName = this.props.cities.filter((cityObj) => cityObj._id === city)
		const visaName = this.props.visas.filter((visaObj) => visaObj._id === visa)

		return (
			<div>
				{this.props.isLoggedIn ? (
					<Container>
						<Grid textAlign="center" style={{ height: '100vh' }} padded>
							<Grid.Column style={{ maxWidth: 450 }}>
								<Header as="h2" color="teal" textAlign="center">
									My Profile
								</Header>
								<Form size="large">
									<Segment stacked>
										<Form.Input
											fluid
											icon="user"
											iconPosition="left"
											name="firstName"
											placeholder={firstName + ' ' + lastName}
											readOnly
										/>

										<Divider hidden />
										<Form.Input
											fluid
											icon="mail"
											iconPosition="left"
											name="email"
											placeholder={email}
											readOnly
										/>

										<Divider hidden />
										<Form.Field>
											<select
												name="city"
												id="city"
												className="form-control"
												disabled
											>
												{this.props.cities
													.filter((cityObj) => cityObj._id === city)
													.map((city) => (
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
												disabled
											>
												{this.props.visas
													.filter((visaObj) => visaObj._id === visa)
													.map((visa) => (
														<option key={visa._id} value={visa._id}>
															{visa.name}
														</option>
													))}
											</select>
										</Form.Field>

										<Divider hidden />

										<Table celled>
											<Table.Header>
												<Table.Row>
													<Table.HeaderCell>Document</Table.HeaderCell>
													<Table.HeaderCell>Status</Table.HeaderCell>
												</Table.Row>
											</Table.Header>

											<Table.Body>
												<Table.Row positive={uploadedEid}>
													<Table.Cell>Emirates ID</Table.Cell>
													<Table.Cell>
														{uploadedEid ? (
															<div>
																<Icon name="checkmark" />
																Uploaded
															</div>
														) : (
															<div>
																<Icon name="close" />
																Upload Pending
															</div>
														)}
													</Table.Cell>
												</Table.Row>
												<Table.Row positive={uploadedPassport}>
													<Table.Cell>Passport</Table.Cell>
													<Table.Cell>
														{uploadedPassport ? (
															<div>
																<Icon name="checkmark" />
																Uploaded
															</div>
														) : (
															<div>
																<Icon name="close" />
																Upload Pending
															</div>
														)}
													</Table.Cell>
												</Table.Row>
											</Table.Body>
										</Table>
									</Segment>
								</Form>
								{!uploadedPassport || !uploadedEid ? (
									<Message>
										Not uploaded your documents yet?{' '}
										<Link to="/upload">Upload them here</Link>
									</Message>
								) : null}
							</Grid.Column>
						</Grid>
					</Container>
				) : (
					<Redirect to="/login" />
				)}
			</div>
		)
	}
}

const mapStateToProps = ({ user, statics }) => ({
	isLoggedIn: user.isLoggedIn,
	userData: user.data,
	cities: statics.cities,
	visas: statics.visas,
})

const mapDispatchToProps = (dispatch) => ({
	loadCities: () => dispatch(loadCities()),
	loadVisas: () => dispatch(loadVisas()),
	getUserDeets: () => dispatch(getUserDeets()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Review)
