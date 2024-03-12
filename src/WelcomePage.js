import React from 'react';
import { Typography, Container, Button, Grid } from '@mui/material';


function WelcomePage() {
  return (
    <Container maxWidth="md" style={{ marginTop: '50px' }}>
      <Typography variant="h2" align="center" gutterBottom>
        Welcome to IoT Dashboard
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        This is a simple IoT dashboard application built with React and Material-UI.
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        You can monitor various IoT metrics and control IoT devices from this dashboard.
      </Typography>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item>
          <Button variant="contained" color="primary">
            Get Started
          </Button>
        </Grid>
        <Grid item>
          <img src="https://content.cdntwrk.com/files/aHViPTg1NDMzJmNtZD1pdGVtZWRpdG9yaW1hZ2UmZmlsZW5hbWU9aXRlbWVkaXRvcmltYWdlXzYzZGI4MTcxZjQxNWEuanBnJnZlcnNpb249MDAwMCZzaWc9MWM4MzhjYmI2YjZlMWVmZTk2YjdlN2I4ODczMTFhZWU%253D" alt="IoT Dashboard" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default WelcomePage;

