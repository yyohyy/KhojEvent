import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';

const PerformanceAnalytics = () => {
  const { id } = useParams(); // Get the id from the route parameter
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/interested-detail/${id}/`);
        if (response.ok) {
          const data = await response.json();
          setEventData(data);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEventData();
  }, [id]);

  // Function to calculate the highest interested events based on attendees or revenue
  const calculateTopEvents = (criteria) => {
    return eventData.sort((a, b) => b[criteria] - a[criteria]).slice(0, 5);
  };

  // Default criteria is attendees
  const topEvents = calculateTopEvents('attendees');

  // Chart data
  const chartData = {
    labels: topEvents.map(event => event.name),
    datasets: [
      {
        label: 'Attendees',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: topEvents.map(event => event.attendees)
      }
    ]
  };

  return (
    <div>
      <h2>Highest Interested Events</h2>
      <Bar
        data={chartData}
        width={100}
        height={50}
        options={{
          maintainAspectRatio: false
        }}
      />
    </div>
  );
};

export default PerformanceAnalytics;