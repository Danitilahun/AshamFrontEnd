import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import setupRealtimeListener from "./fetchData";

const New = () => {
  const dispatch = useDispatch();
  const branches = useSelector((state) => state.branches.branches);
  const loading = useSelector((state) => state.branches.loading);
  const error = useSelector((state) => state.branches.error);

  useEffect(() => {
    // Set up the real-time listener when the component mounts
    dispatch(setupRealtimeListener());
  }, [dispatch]);

  console.log("------------all----------branches", branches);
  return (
    <div className="App">
      <h1>Branches</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {branches.map((branch) => (
            <li key={branch.id}>{branch.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default New;
