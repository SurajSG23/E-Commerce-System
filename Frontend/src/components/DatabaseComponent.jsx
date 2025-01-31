// src/DatabaseComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DatabaseComponent = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Call the backend API to fetch data
    axios.get('https://e-commerce-system-nine.vercel.app/data')  // Adjust this URL based on your backend
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        setError('Error fetching data');
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h1>Database Data</h1>
      {error && <p>{error}</p>}
      <ul>
        {data.length > 0 ? (
          data.map((item, index) => (
            <li key={index}>{item.name}</li>  // Adjust based on your actual data structure
          ))
        ) : (
          <p>No data available</p>
        )}
      </ul>
    </div>
  );
};

export default DatabaseComponent;
