import React, { useState, useEffect } from 'react';

const LoadingToRedirect = () => {
	const [count, setCount] = useState(5);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCount((currentCount) => --currentCount);
		}, 1000);
		if (count === 0) {
			window.location = 'http://localhost:3000/login';
		}
		return () => {
			clearInterval(intervalId);
		};
	}, [count]);

	return (
		<div className='container p-5 text-center'>
			<p>Redirecting you in {count} seconds</p>
		</div>
	);
};

export default LoadingToRedirect;
