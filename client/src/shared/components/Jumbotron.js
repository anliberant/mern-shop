import React from 'react';
import Typewriter from 'typewriter-effect';

const Jumbotron = ({ strings }) => {
	return (
		<Typewriter
			options={{
				strings,
				autoStart: true,
				loop: true,
			}}
		/>
	);
};

export default Jumbotron;
