import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { LinearScale } from 'chart.js'; // Import LinearScale from Chart.js

const PerformanceAnalytics = () => {
  const { id } = useParams();
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

  const calculateTopEvents = (criteria) => {
    return eventData.sort((a, b) => b[criteria] - a[criteria]).slice(0, 5);
  };

  const topEvents = calculateTopEvents('attendees');

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

  LinearScale.id = 'linear'; // Register LinearScale as 'linear'

  return (
    <div>
      <h2>Highest Interested Events</h2>
      <Bar
        data={chartData}
        options={{
          scales: {
            y: {
              type: 'linear' // Use 'linear' scale for y-axis
            }
          }
        }}
      />
    </div>
  );
};

export default PerformanceAnalytics;