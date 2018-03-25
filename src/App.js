import React, { Component } from 'react';
import './App.css';
import VideoComponent from './components/VideoComponent'
import ListComponent from './components/ListComponent'
import { Container, Row, Col } from 'reactstrap';

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount() {

    fetch('song/list')
    .then(res => res.json())
    .then(data => {
      console.log('data', data)
      this.setState(data)
    })

    // this.callApi()
    //   .then(res => this.setState(res))
    //   .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('http://220.230.117.71:3000/song/count');
    console.log('response', response)
    const body = await response.json();

    

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="App">
        <Container>
          <Row className="show-grid">
            <Col xs="12" lg="6">
              <VideoComponent></VideoComponent>
            </Col>
            <Col xs="12" lg="6">
              <ListComponent songList={this.state.result}></ListComponent>
            </Col>
          </Row>
        </Container>
        <footer><b>ddulh</b> ddulhddul@gmail.com</footer>
      </div>
    );
  }
}

export default App;
