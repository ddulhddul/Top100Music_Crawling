import React, { Component } from 'react'
import VideoControlComponent from './VideoControlComponent'
import YouTube from 'react-youtube'
import { connect } from 'react-redux';
import { setVideoId, setVideoNum } from '../actions'

class VideoComponent extends Component {

    constructor(props){
        super(props)
        this.state = {
            player :undefined
        }
        this.onStateChange = this.onStateChange.bind(this)
        this._onReady = this._onReady.bind(this)
    }
    
    componentDidUpdate(){
        console.log('num Change', this.props.num)
        let num = this.props.num
        fetch(`song/change?yymmddhh=${this.props.yymmddhh}&num=${num}`)
            .then(res => res.json())
            .then(result => {
                
                let obj = this.props.result.filter((value,index)=>{
                    return value.num === num ? true: false
                })[0]
                obj = obj ? obj : {singer:'', song:''}
                this.props.setVideoId(result.url, obj.singer, obj.song)
                document.title = `${obj.singer} - ${obj.song}`
                // if(this.state.player) this.state.player.cuePlaylist([result.url]);
                let player = this.state.player
                setTimeout(function(){
                    // console.log('prevent error', new Date())
                    player && player.getPlayerState() != 1 && player.playVideo()
                 }, 1500);
            })
    }

    playVideoCustom(videoId){
        console.log('videoId', videoId)
        let player = this.state.player
        if(player.getPlayerState() === 1) return;
        if(videoId) player.cuePlaylist([videoId]);
        else player.playVideo()
        
        // 플레이하지 않는 경우 방지, 5초후 다시 실행
        setTimeout(function(){
            // console.log('prevent error', new Date())
            player && player.getPlayerState() != 1 && player.playVideo()
         }, 3000);
    }

    playNextNum(num){
        let songObj = this.props.result.filter((value,index)=>{
            return value.num === num ? true: false
        })[0]
        this.playVideoCustom(songObj.videoId)
    }

    onStateChange(event){
        console.log('onStateChange',event, this.state.player)
        if(event.data === 5) {
            // this.playNextNum(this.props.num)

        }else if(event.data === 0){ // Player End
            // playType 에 따라 분기처리 필요
            // this.playNextNum(this.props.num)
            this.props.setVideoNum(Math.ceil(Math.random()*100))
        }
    }

    _onReady(event){
        this.setState({
            player: event.target
        })
    }

    render() {
        return (
            <div className='Video'>
                <h4 style={{textAlign: 'center'}}><b>{this.props.song} <small>{this.props.singer}</small></b></h4>
                <YouTube
                    className='embed-responsive embed-responsive-16by9'
                    videoId={this.props.videoId}                  // defaults -> null
                    opts={{
                        playerVars: { // https://developers.google.com/youtube/player_parameters
                            // autoplay: 1
                        }
                    }}
                    onReady={this._onReady}                    // defaults -> noop
                    // onPlay={func}                     // defaults -> noop
                    // onPause={func}                    // defaults -> noop
                    // onEnd={func}                      // defaults -> noop
                    // onError={this.__onError}                    // defaults -> noop
                    onStateChange={this.onStateChange}              // defaults -> noop
                    // onPlaybackRateChange={func}       // defaults -> noop
                    // onPlaybackQualityChange={func}    // defaults -> noop
                />
                <VideoControlComponent />
            </div>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        yymmddhh : state.videoInfo.yymmddhh,
        result : state.videoInfo.result,
        num : state.videoInfo.num
    };
}
let mapDispatchToProps = (dispatch) => {
    return {
        setVideoId: (videoId, singer, song) => dispatch(setVideoId(videoId, singer, song)),
        setVideoNum: (num) => dispatch(setVideoNum(num))
    }
}
VideoComponent = connect(mapStateToProps, mapDispatchToProps)(VideoComponent);
export default VideoComponent;