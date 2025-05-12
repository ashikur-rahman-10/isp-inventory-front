import React from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

const RevirewCard = ({ review }) => {
    return (
        <div className='px-6'>
            <div className='flex items-center gap-5 pb-3'>
                <div className="flex items-center gap-1 mb-2">
                    <Rating value={review.rating} readOnly style={{ maxWidth: 100 }} />   (  {review?.rating} )
                </div>
                <p>{review.userName}</p>
            </div>
            <div>
                <p>{review.comment}</p>
                <div className=' w-64  border m-10 rounded-md '>
                    <img className=' ' src={review?.image} alt="" />
                </div>
            </div>

        </div>
    );
};

export default RevirewCard;