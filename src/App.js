import React, { Component } from 'react';
import './App.css';
import VideoComponent from './components/VideoComponent'
import ListComponent from './components/ListComponent'
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { setVideoInfo } from './actions';

class App extends Component {

  componentDidMount() {

    this.callApi()
      .then(res => {
        console.log('result', res)
        this.props.setInfos(res)
      })
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('song/list');
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
              <VideoComponent videoId={this.props.videoId}></VideoComponent>
            </Col>
            <Col xs="12" lg="6">
              <ListComponent 
                songList={this.props.result}
                {...this.props}
              ></ListComponent>
            </Col>
          </Row>
        </Container>
        <footer><b>ddulh</b> ddulhddul@gmail.com</footer>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    videoId : state.videoInfo.videoId,
    ...state.videoInfo
  };
}

let mapDispatchToProps = (dispatch) => {
  return {
    setInfos: (param) => dispatch(setVideoInfo(param))
  }
}

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App;
