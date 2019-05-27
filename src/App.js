import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import ApolloClient from 'apollo-boost';

import { ApolloProvider, ApolloConsumer } from 'react-apollo';
import { DelayedUser, AllUsers, CreateUser } from './components/UserQuery';

const client = new ApolloClient({
	uri: `https://adsai.dk/mini-project/graphql`
});

const App = () => {
	const [UserList, setUsers] = useState([]);
	const [showAllusers, setShowAllUsers] = useState(false);
	return (
		<ApolloProvider client={client}>
			<link
				rel="stylesheet"
				href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
				integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
				crossOrigin="anonymous"
			/>
			<CreateUser />
			{/* <DelayedUser />
			<button onClick={() => setShowAllUsers(!showAllusers)}>
				{showAllusers ? 'Hide all users' : 'Show all users'}
			</button>
			{showAllusers && <AllUsers setUsers={setUsers} />} */}
		</ApolloProvider>
	);
};
export default App;
