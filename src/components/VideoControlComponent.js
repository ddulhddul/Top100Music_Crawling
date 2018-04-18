import React, { Component } from 'react'
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import { IoStop, IoIosFastforward, IoIosPlay } from 'react-icons/lib/io'
import { FaComments, FaRefresh, FaRandom } from 'react-icons/lib/fa'
import { connect } from 'react-redux';
import { setVideoHidden, setPlayType, setVideoNum } from '../actions'
import VideoComponent from './VideoComponent'

class VideoControlComponent extends Component {

    constructor(props){
        super(props)
        this.state = {
            playerHidden: true
        }
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
                this.props.player.playVideo()
                break;
        }
        
    }

    render() {
        return (
            <div className='Video'>
                <h4 style={{textAlign: 'center'}}><b>{this.props.song} <small>{this.props.singer}</small></b></h4>
                <div style={{display: this.state.playerHidden ? 'none' : ''}}>
                    <VideoComponent fastforward={this.fastforward}/>
                </div>
                <div className='VideoControl'>
                    <div style={{'textAlign':'right', 'margin':'0px 0px -10px 0px'}}>
                        <button 
                            id="playerHiddenBtn" 
                            style={{'padding':'0px','fontSize':'9px','fontWeight':'bold'}} 
                            onClick={()=>{
                                this.setState({playerHidden: !this.state.playerHidden})
                                this.props.setVideoHidden(!this.state.playerHidden)
                            }}
                            className={this.state.playerHidden ? "btn btn-dark" : 'btn'} >
                            hidden
                        </button>
                    </div>
                    <ButtonToolbar>
                        <ButtonGroup className="btnGrp">
                            <Button id="messageBtn"><FaComments /></Button>
                        </ButtonGroup>

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
            </div>
            
            
        )
    }
}

let mapStateToProps = (state) => {
    return {
      totNum : state.videoInfo.totNum,
      num : state.videoInfo.num,
      playType : state.videoInfo.playType,
      song : state.videoInfo.song,
      singer : state.videoInfo.singer,
      player : state.videoInfo.player
    };
  }
let mapDispatchToProps = (dispatch) => {
    return {
        setVideoHidden: (videoHidden) => dispatch(setVideoHidden(videoHidden)),
        setPlayType: (playType) => dispatch(setPlayType(playType)),
        setVideoNum: (num) => dispatch(setVideoNum(num))
    }
}
VideoControlComponent = connect(mapStateToProps, mapDispatchToProps)(VideoControlComponent);
export default VideoControlComponent;