import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button, Menu, Container, Icon } from 'semantic-ui-react'
import { logUserOut } from '../store/user'
import { Link } from 'react-router-dom'

export class NavBar extends Component {
	render() {
		return (
			<Menu>
				<Container text>
					<Menu.Item position="right">
						{this.props.isUserLoggedIn ? (
							<div>
								<Link to="/review">
									<Button style={{ marginRight: 20 }}>
										<Icon name="user circle"></Icon> Profile
									</Button>
								</Link>
								<Button primary onClick={this.props.logOut}>
									Log Out
								</Button>
							</div>
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
