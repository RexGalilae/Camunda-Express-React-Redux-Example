import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button, Menu, Container } from 'semantic-ui-react'
import { logUserOut } from '../store/user'
import { Link } from 'react-router-dom'

export class NavBar extends Component {
	render() {
		return (
			<Menu>
				<Container text>
					<Menu.Item position="right">
						{this.props.isUserLoggedIn ? (
							<Button primary onClick={this.props.logOut}>
								Log Out
							</Button>
						) : (
							<>
								<Link to="/login">
									<Button style={{ marginRight: 20 }}>Log-in</Button>
								</Link>
								<Link to="/signup">
									<Button primary>Sign up</Button>
								</Link>
							</>
						)}
					</Menu.Item>
				</Container>
			</Menu>
		)
	}
}

const mapStateToProps = (state) => ({
	isUserLoggedIn: state.user.isLoggedIn,
})

const mapDispatchToProps = {
	logOut: logUserOut,
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
