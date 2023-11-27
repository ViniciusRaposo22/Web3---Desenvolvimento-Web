import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import '../App.css';

const NeoList = () => {
  const [neoData, setNeoData] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchNeoData = async (page = 1) => {
    try {
      const apiKey = 'DKcAdiLeBtHElhBPX9ISVbBE4xoJnnQNJlRE023h';
      const apiUrl = `https://api.nasa.gov/neo/rest/v1/neo/browse?page=${page}&api_key=${apiKey}`;
      const response = await axios.get(apiUrl);

      setNeoData(response.data.near_earth_objects);
      setPagination({
        next: response.data.links.next,
        prev: response.data.links.prev,
      });
    } catch (error) {
      console.error('Error fetching NEO data:', error);
    }
  };

  useEffect(() => {
    fetchNeoData();
  }, []);

  return (
    <Container>
      <h1 className="mt-4 mb-4">NEO Explorer</h1>
      <Row>
        {neoData.map((neo) => (
          <Col key={neo.id} md={4} className="mb-4">
            <Card className="custom-card">
              <Card.Body>
                <Card.Title>{neo.name}</Card.Title>
                <Card.Text>
                  <strong>Estimated Diameter:</strong>{' '}
                  {`${neo.estimated_diameter.kilometers.estimated_diameter_min} km - ${neo.estimated_diameter.kilometers.estimated_diameter_max} km`}
                  <br />
                  <strong>First Observation Date:</strong> {neo.orbital_data.first_observation_date} <br />
                  <strong>Last Observation Date:</strong> {neo.orbital_data.last_observation_date}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mt-4">
        <Col>
          {pagination.prev && (
            <Button variant="secondary" onClick={() => fetchNeoData(pagination.prev)}>
              Previous
            </Button>
          )}
        </Col>
        <Col className="text-right">
          {pagination.next && (
            <Button variant="secondary" onClick={() => fetchNeoData(pagination.next)}>
              Next
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default NeoList;
