import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Grid } from "@mui/material";

import Cookies from 'js-cookie';

import { useNavigate } from "react-router-dom";

function extractData(obj, target) {

  const data = [];

  function extract(obj) {
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        // If the value is an object, recursively call extract
        extract(obj[key]);
      } else if (key === target) {
        // If the key is 'temperature', push the value to temperatures array
        data.push(obj[key]);
      }
    }
  }

  extract(obj);

  return data;
}

function MyChart(props) {
  const { selectedMenuItem } = props;

  const [data, setData] = useState([]);
  const chartRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedSelectedMenuItem = Cookies.get('selectedMenuItem');
    if (storedSelectedMenuItem) {
      props.setSelectedMenuItem(storedSelectedMenuItem);
    }
  }, []);

  useEffect(() => {
    if (!(Cookies.get("email") && Cookies.get("username"))) {
      navigate("/auth/login");
    }
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log('Connected to websocket server');
    };

    socket.onmessage = event => {
      const newData = JSON.parse(event.data);

      const storedSelectedMenuItem = Cookies.get('selectedMenuItem');
      const data = extractData(newData, storedSelectedMenuItem.toLowerCase())

      console.log(data)

      setData(data);
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (data.length > 0 && chartRef.current) {
      const chart = chartRef.current;

      chart.data.labels = data.map((_, index) => index + 1);
      chart.data.datasets[0].data = data;

      chart.update();
    }
  }, [data]);

  useEffect(() => {
    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Live Data',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="Chart">
      <Grid container justifyContent="center">
        <Grid item>
          <h1>Live Data Chart {selectedMenuItem}</h1>
        </Grid>
      </Grid>
      <canvas id="myChart" width="400" height="150"></canvas>
    </div>
  );
}

export default MyChart;

