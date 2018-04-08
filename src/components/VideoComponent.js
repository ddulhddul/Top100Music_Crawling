import React, { Component } from 'react'
// import VideoControlComponent from './VideoControlComponent'
import YouTube from 'react-youtube'
import { connect } from 'react-redux';
import { setVideoId, setVideoNum, setVideoPlayer } from '../actions'

class VideoComponent extends Component {

    constructor(props){
        super(props)
        this.state = {
            player : undefined
        }

        this.onStateChange = this.onStateChange.bind(this)
        this._onReady = this._onReady.bind(this)
        this.setVideoTitleAndPlay = this.setVideoTitleAndPlay.bind(this)
    }
    
    componentDidUpdate(){
        let num = this.props.num
        let obj = this.props.result.filter((value,index)=>{
            return value.num === num ? true: false
        })[0]
        obj = obj ? obj : {singer:'', song:''}
        if(obj.videoId){
            this.setVideoTitleAndPlay(obj, num)
        }else{
            fetch(`song/change?yymmddhh=${this.props.yymmddhh}&num=${num}`)
                .then(res => res.json())
                .then(result => {
                    obj.videoId = result.url
                    this.setVideoTitleAndPlay(obj, num)
                })
        }
        
    }

    setVideoTitleAndPlay(obj, num){
        this.props.setVideoId(obj.videoId, obj.singer, obj.song)
        if(obj.singer && obj.song) document.title = `${obj.singer} - ${obj.song}`
        if(document.getElementById(num)) document.getElementById('listDiv').scrollTop = document.getElementById(num).offsetTop
        this.playVideo()
    }

    playVideo(){
        let player = this.state.player
        setTimeout(function(){
            // console.log('prevent error', new Date())
            player && player.getPlayerState() !== 1 && player.playVideo()
         }, 1500);
    }

    onStateChange(event){
        // console.log('event change', event.data)
        if(event.data === 5) {
            // this.playNextNum(this.props.num)

        }else if(event.data === 0){ // Player End
            // playType 에 따라 분기처리 필요
            // this.playNextNum(this.props.num)
            this.props.fastforward()
        }
    }

    _onReady(event){
        this.props.setVideoPlayer(event.target)
        this.setState({player: event.target})
    }

    render() {
        return (
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
        )
    }
}

let mapStateToProps = (state) => {
    return {
        yymmddhh : state.videoInfo.yymmddhh,
        result : state.videoInfo.result,
        playType : state.videoInfo.playType,
        totNum : state.videoInfo.totNum,
        videoId : state.videoInfo.videoId,
        num : state.videoInfo.num
    };
}
let mapDispatchToProps = (dispatch) => {
    return {
        setVideoId: (videoId, singer, song) => dispatch(setVideoId(videoId, singer, song)),
        setVideoPlayer: (player) => dispatch(setVideoPlayer(player)),
        setVideoNum: (num) => dispatch(setVideoNum(num))
    }
}
VideoComponent = connect(mapStateToProps, mapDispatchToProps)(VideoComponent);
export default VideoComponent;