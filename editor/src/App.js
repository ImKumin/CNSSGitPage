import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/Cell';
import Notebook from "./components/Notebook";

function App() {
	return (
		<React.Fragment>
			<Notebook/>
		</React.Fragment>
	);
}

export default App;
