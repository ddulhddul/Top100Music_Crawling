import React, { Component } from 'react'
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import { IoStop, IoIosFastforward, IoIosPlay } from 'react-icons/lib/io'
import { FaRefresh, FaRandom } from 'react-icons/lib/fa'
import { connect } from 'react-redux';
import { setPlayType, setVideoNum } from '../actions'

class VideoControlComponent extends Component {

    constructor(props){
        super(props)
        
        this.fastforward = this.fastforward.bind(this)
    }

    componentDidMount(){
        if(!this.props.playType) this.props.setPlayType('s')
    }

    fastforward(){
        let playType = this.props.playType
        let totNum = this.props.totNum
        switch (playType) {
            case 's':
                this.props.setVideoNum((this.props.num+1)%totNum)
                break;
            case 'r':
                this.props.setVideoNum(Math.ceil(Math.random()*totNum))
                break;
            default:
                this.playVideo()
                break;
        }
        
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
                        <Button onClick={()=>this.props.player && this.props.player.pauseVideo()} color="warning"><IoStop /></Button>
                        <Button onClick={()=>this.props.player && this.props.player.playVideo()} color="primary"><IoIosPlay /></Button>
                        <Button onClick={this.fastforward} color="danger"><IoIosFastforward /></Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </div>
        )
    }
}

let mapStateToProps = (state) => {
    return {
      totNum : state.videoInfo.totNum,
      num : state.videoInfo.num,
      playType : state.videoInfo.playType,
      player : state.videoInfo.player
    };
  }
let mapDispatchToProps = (dispatch) => {
    return {
        setPlayType: (playType) => dispatch(setPlayType(playType)),
        setVideoNum: (num) => dispatch(setVideoNum(num))
    }
}
VideoControlComponent = connect(mapStateToProps, mapDispatchToProps)(VideoControlComponent);
export default VideoControlComponent;