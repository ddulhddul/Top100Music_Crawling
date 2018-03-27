import React, { Component } from 'react'
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import { IoStop, IoIosFastforward, IoIosPlay } from 'react-icons/lib/io'
import { FaRefresh, FaRandom } from 'react-icons/lib/fa'
import { connect } from 'react-redux';
import { setPlayType } from '../actions'

class VideoControlComponent extends Component {

    componentDidMount(){
        if(!this.props.playType) this.props.setPlayType('s')
    }

    render() {
        return (
            <div className='VideoControl'>
                <ButtonToolbar>
                    <ButtonGroup className="btnGrp">
                        <Button onClick={()=>this.props.setPlayType('1')} color={this.props.playType==='1'?"info":"default"}><b>1</b></Button>
                        <Button onClick={()=>this.props.setPlayType('s')} color={this.props.playType==='s'?"info":"default"}><FaRefresh /></Button>
                        <Button onClick={()=>this.props.setPlayType('r')} color={this.props.playType==='r'?"info":"default"}><FaRandom /></Button>
                    </ButtonGroup>

                    <ButtonGroup className="btnGrp">
                        <Button color="warning"><IoStop /></Button>
                        <Button color="primary"><IoIosPlay /></Button>
                        <Button color="danger"><IoIosFastforward /></Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </div>
        )
    }
}

let mapStateToProps = (state) => {
    return {
      playType : state.videoInfo.playType
    };
  }
let mapDispatchToProps = (dispatch) => {
    return {
        setPlayType: (playType) => dispatch(setPlayType(playType))
    }
}
VideoControlComponent = connect(mapStateToProps, mapDispatchToProps)(VideoControlComponent);
export default VideoControlComponent;