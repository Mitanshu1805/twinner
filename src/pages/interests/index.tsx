import React, { useEffect } from "react";
import { Card, Table } from "react-bootstrap";
import { useRedux } from '../../hooks';
import { interestList } from "../../redux/interestAndHobbies/actions";
import { RootState } from "../../redux/store";
import BorderedTable from "../tables/BasicTable/BorderedTable";

// Define the type for an interest
interface Interest {
    interest_id: string;
    interest_name: string;
    interest_image: string;
}

const InterestHobbies = () => {
    const { dispatch, appSelector } = useRedux();
    const { interests = [], loading, error } = appSelector((state: RootState) => state.interest);
    const interestListData = interests?.data || [];
    // const { interests, loading, error } = appSelector((state: RootState) => state.interest.interests?.data || []);

    console.log("Redux interests state:", interests);
    console.log("Type of interests:", typeof interests);
    console.log("Redux interests state:", interests);
    console.log("Type of interests:", typeof interests);
    console.log("Interests data:", interests?.data);
    console.log("Interests array length:", interests?.data?.length);



    useEffect(() => {
        dispatch(interestList()); // Dispatch action to fetch interests
    }, [dispatch]);

    // return (
    //     <Card>
    //         <Card.Body>
    //             <h4 className="header-title">Interests & Hobbies</h4>

    //             {loading && <p>Loading...</p>}
    //             {error && <p style={{ color: "red" }}>{error}</p>}

    //             {!loading && interestListData.length > 0 ? (
    //                 <Table bordered hover>
    //                     <thead>
    //                         <tr>
    //                             <th>#</th>
    //                             <th>Interest Name</th>
    //                             <th>Image</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         {interestListData.map((interest: Interest, index: number) => (
    //                             <tr key={interest.interest_id}>
    //                                 <td>{index + 1}</td>
    //                                 <td>{interest.interest_name}</td>
    //                                 <td>
    //                                     <img
    //                                         src={interest.interest_image}
    //                                         alt={interest.interest_name}
    //                                         width="50"
    //                                         height="50"
    //                                         style={{ borderRadius: "8px" }}
    //                                     />
    //                                 </td>
    //                             </tr>
    //                         ))}
    //                     </tbody>
    //                 </Table>
    //             ) : (
    //                 !loading && <p>No interests found.</p>
    //             )}
    //         </Card.Body>
    //     </Card>
    // );

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Use BorderedTable and pass interests data */}
            {!loading && <BorderedTable interests={interestListData} />}
        </div>
    );
};

export default InterestHobbies;
