import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { uploadUserFiles } from '../store/user'

import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'

export class Upload extends Component {
	state = {
		eid: { file: null, valid: true },
		passport: { file: null, valid: true },
	}

	onFileUpload = ({ target }) => {
		const file = target.files[0]
		const tempState = this.state
		const acceptableTypes = ['image/png', 'application/pdf', 'image/jpeg']
		try {
			if (!acceptableTypes.includes(file.type)) {
				tempState[target.name].valid = false
				tempState[target.name].file = null
			} else {
				tempState[target.name].file = file
				tempState[target.name].valid = true
			}
			this.setState(tempState)
		} catch (e) {
			console.log(e)
		}
	}

	isFormReadyToSubmit = () => this.state.eid.file && this.state.passport.file

	handleFormSubmit = async () => {
		try {
			this.props.uploadUserFiles()
		} catch (error) {
			console.log(error)
		}

		this.props.history.push('/review')
	}

	render() {
		return (
			<React.Fragment>
				{this.props.isUserLoggedIn ? (
					<Grid textAlign="center" style={{ height: '100vh' }}>
						<Grid.Column style={{ maxWidth: 450 }}>
							<Header as="h2" color="teal" textAlign="center">
								Upload Files
							</Header>
							<Form size="large">
								<Segment stacked>
									<Form.Field
										error={
											!this.state.eid.valid
												? {
														content:
															'The file can only be of a .pdf, .png or a .jpg format',
														pointing: 'below',
												  }
												: false
										}
									>
										<label htmlFor="eid">Emirates ID</label>
										<input
											type="file"
											onChange={this.onFileUpload}
											name="eid"
											required
										/>
									</Form.Field>
									<Form.Field
										error={
											!this.state.passport.valid
												? {
														content:
															'The file can only be of a .pdf, .png or a .jpg format',
														pointing: 'below',
												  }
												: false
										}
									>
										<label htmlFor="passport">Passport</label>
										<input
											type="file"
											onChange={this.onFileUpload}
											name="passport"
											required
										/>
									</Form.Field>
									<Button
										color="teal"
										fluid
										size="large"
										disabled={!this.isFormReadyToSubmit()}
										onClick={(e) => this.handleFormSubmit(e)}
									>
										Submit
									</Button>
								</Segment>
							</Form>
						</Grid.Column>
					</Grid>
				) : (
					<Redirect to="/login" />
				)}
			</React.Fragment>
		)
	}
}

const mapStateToProps = ({ user: { data, isLoggedIn } }) => ({
	isUserLoggedIn: isLoggedIn,
	documentsUploaded: data.passportUploaded && data.passportUploaded,
})

const mapDispatchToProps = (dispatch) => ({
	uploadUserFiles: () => dispatch(uploadUserFiles()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Upload)
