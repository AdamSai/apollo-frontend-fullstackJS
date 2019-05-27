import React, { useState, Component } from 'react';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { Query, ApolloConsumer, Mutation } from 'react-apollo';
import _ from 'lodash';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';

const GET_USERS = gql`
	{
		getAllUsers {
			firstName
			lastName
			email
			created
		}
	}
`;

const GET_USER = gql`
	query User($ID: ID!) {
		getOneUser(id: $ID) {
			firstName
			lastName
			email
			created
		}
	}
`;

const CREATE_USER = gql`
	mutation CreateUser($UserInput: UserInput) {
		createUser(input: $UserInput)
	}
`;

class CreateUser extends Component {
	constructor(props) {
		super(props);
		this.state = { userInput: {} };
	}

	render() {
		return (
			<>
				<Mutation mutation={CREATE_USER}>
					{(createUser) => (
						<div>
							<form
								onSubmit={async (e) => {
									e.preventDefault();
									const response = await createUser({
										variables: { UserInput: this.state.userInput }
									});
									this.setState({ response: response.data.createUser });
								}}
								onChange={(e) => {
									let userInput = this.state.userInput;
									userInput[e.target.name] = e.target.value;
									this.setState({ userInput: userInput });
								}}>
								<input name="firstName" placeholder="First Name" />
								<input name="lastName" placeholder="Surname" />
								<input name="username" placeholder="Username" />
								<input name="password" type="password" placeholder="Password" />
								<input name="email" placeholder="Email" />
								<button>Submit</button>
							</form>
						</div>
					)}
				</Mutation>
				{this.state && JSON.stringify(this.state)}
				{this.state.response &&
					`${JSON.parse(this.state.response).status} ${
						JSON.parse(this.state.response).msg
					}`}
			</>
		);
	}
}

const User = ({ id }) => (
	<Query query={GET_USER} variables={{ id }} skip={!id} notifyOnNetworkStatusChange>
		{({ loading, error, data, refetch, networkStatus }) => {
			if (networkStatus === 4) return 'Refetching!';
			if (loading) return null;
			if (error) return `Error! ${error}`;
			return (
				<ListGroup>
					<ListGroup.Item>{data.firstName}</ListGroup.Item>
					<ListGroup.Item>{data.lastName}</ListGroup.Item>
					<ListGroup.Item>{data.email}</ListGroup.Item>
					<ListGroup.Item>{data.created}</ListGroup.Item>
				</ListGroup>
			);
		}}
	</Query>
);

const DelayedUser = () => {
	const [selectedUser, selectUser] = useState(undefined);
	const [userId, setUserId] = useState(undefined);
	const [error, setError] = useState(undefined);

	return (
		<>
			<h2>Find a user</h2>
			<ApolloConsumer>
				{(client) => (
					<div>
						{selectedUser && JSON.stringify(selectUser)}
						<input
							type="text"
							placeholder="Enter user ID"
							onChange={(e) => setUserId(e.target.value)}
						/>
						<button
							onClick={async () => {
								try {
									setError(undefined);
									const { loading, data } = await client.query({
										query: GET_USER,
										variables: { ID: userId }
									});
									console.log(loading);
									selectUser(data.getOneUser);
								} catch (e) {
									setError(e);
								}
							}}>
							Find user
						</button>
					</div>
				)}
			</ApolloConsumer>
			{error && JSON.stringify(error)}
			{selectedUser && (
				<ListGroup>
					<ListGroup.Item>{`First name: ${selectedUser.firstName}`}</ListGroup.Item>
					<ListGroup.Item>{`Last name: ${selectedUser.lastName}`}</ListGroup.Item>
					<ListGroup.Item>{`Email: ${selectedUser.email}`}</ListGroup.Item>
					<ListGroup.Item>{`Created: ${selectedUser.created}`}</ListGroup.Item>
				</ListGroup>
			)}
		</>
	);
};

const AllUsers = ({}) => (
	<Query query={GET_USERS}>
		{({ loading, error, data }) => {
			if (loading) return 'Loading...';
			if (error) return `Error! ${error.message}`;
			return (
				<div>
					<h2>List of all users</h2>
					{createTable(data.getAllUsers)}
				</div>
			);
		}}
	</Query>
);

const createTable = (array) => {
	const headers = _.keys(array[0])
		.map((key) => _.startCase(key))
		.map((value, index) => (
			<th key={index} scope="col">
				{value}
			</th>
		));
	//Remove the last header that graphql comes with
	headers.pop();
	const body = array.map((value, index) => {
		return (
			<tr key={index}>
				<td>{index}</td>
				<td>{value.firstName}</td>
				<td>{value.lastName}</td>
				<td>{value.email}</td>
				<td>{value.created}</td>
			</tr>
		);
	});
	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th scope="col">#</th>
					{headers}
				</tr>
			</thead>
			<tbody>{body}</tbody>
		</Table>
	);
};

export { AllUsers, DelayedUser, User, CreateUser };
