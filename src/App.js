import React, { Component } from 'react';
import './App.css';
import VideoControlComponent from './components/VideoControlComponent'
import ListComponent from './components/ListComponent'
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { setVideoInfo } from './actions';

class App extends Component {

  defaultProps = {
    videoHidden: true
  }
  
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
        <Container style={{
          width: this.props.videoHidden === undefined || this.props.videoHidden ? '60%': '100%'
        }}>
          <Row className="show-grid">
            <Col xs="12" lg={this.props.videoHidden === undefined || this.props.videoHidden ? "12": "6"}>
              <VideoControlComponent />
            </Col>
            <Col xs="12" lg={this.props.videoHidden === undefined || this.props.videoHidden ? "12": "6"}>
              <ListComponent 
                songList={this.props.result}
                yymmddhh={this.props.yymmddhh}
                num={this.props.num}
              ></ListComponent>
            </Col>
          </Row>
        </Container>
        <footer>
          <p> 
            <strong style={{cursor:'pointer',marginRight:'5px'}}
              onClick={()=>window.open('https://github.com/ddulhddul/Top100Music_Crawling')}>ddulh
            </strong><small>ddulhddul@gmail.com</small>
            <span style={{marginLeft:'10px', fontSize:'11px'}}>contributed by &nbsp;
              <b style={{cursor:'pointer'}} onClick={()=>window.open('https://github.com/Kitchu0401')}>kitchu</b>
            </span>
          </p>
        </footer>
        
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    videoId : state.videoInfo.videoId,
    videoHidden : state.videoInfo.videoHidden,
    singer : state.videoInfo.singer,
    song : state.videoInfo.song,
    result : state.videoInfo.result,
    yymmddhh : state.videoInfo.yymmddhh,
    num : state.videoInfo.num
  };
}

let mapDispatchToProps = (dispatch) => {
  return {
    setInfos: (param) => dispatch(setVideoInfo(param))
  }
}

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App;
