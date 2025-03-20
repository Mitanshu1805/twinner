import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { interestList } from '../../redux/interestAndHobbies/actions';
import { RootState } from '../../redux/store'; // Import your RootState type

const InterestHobbies = () => {
    const dispatch = useDispatch();
    const { interests, loading, error } = useSelector((state: RootState) => state.interestReducer);

    useEffect(() => {
        dispatch(interestList());
    }, [dispatch]);

    return (
        <div>
            <h1>Interests & Hobbies</h1>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {/* {interests.map((interest) => (
                    <li key={interest.interest_id}>
                        {interest.interest_name}{' '}
                        <img src={interest.interest_image} alt={interest.interest_name} width="50" />
                    </li>
                ))} */}
            </ul>
        </div>
    );
};

export default InterestHobbies;
