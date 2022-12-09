import React from 'react';
import { Rating } from 'react-simple-star-rating';

const Star = ({ starsNumber, starsHandler, readonly }) => {
	return (
		<div onClick={() => starsHandler(starsNumber)} className='pt-4'>
			<Rating
				initialValue={starsNumber}
				readonly={readonly}
				size={30}
				/* Available Props */
			/>
		</div>
	);
};
export default Star;
