import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const Trending = () => {
  const [eventsData, setEventsData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      const authToken = localStorage.getItem("Bearer");
      const response = await axios.get(`http://127.0.0.1:8000/interested-detail/${localStorage.getItem("id")}/`, {
          headers: {
              Authorization: `Bearer ${authToken}`,
          },
      });
      const eventDataWithInterestCount = calculateInterestCount(response.data);
      setEventsData(eventDataWithInterestCount);
    } catch (error) {
      console.error('Error fetching events data:', error);
    }
  };

  const calculateInterestCount = (data) => {
    const interestCounts = {};
    data.forEach((interest) => {
      const eventId = interest.event.id;
      interestCounts[eventId] = interestCounts[eventId] ? interestCounts[eventId] + 1 : 1;
    });
    return data.map((interest) => ({
      eventName: interest.event.name,
      interestCount: interestCounts[interest.event.id] || 0,
    }));
  };

  const prepareChartData = () => {
    const labels = eventsData.map(event => event.eventName);
    const data = eventsData.map(event => event.interestCount);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Interest Count',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Destroy the chart instance when the component unmounts
  useEffect(() => {
    return () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="container">
      <h2 className="mt-5 mb-3">Trending Events</h2>
      <div className="card">
        <div className="card-body">
          <div className="chart-container" style={{ height: '400px', width: '600px' }}>
            <Bar
              ref={chartRef}
              data={prepareChartData()}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    type: 'linear',
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;
