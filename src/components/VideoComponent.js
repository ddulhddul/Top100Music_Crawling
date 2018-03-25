import React, { Component } from 'react'
import VideoControlComponent from './VideoControlComponent'
import YouTube from 'react-youtube'

class VideoComponent extends Component {

    render() {
        return (
            <div className='Video'>
                <h4><b>{this.props.song} <small>{this.props.singer}</small></b></h4>
                <YouTube
                    className='embed-responsive embed-responsive-16by9'
                    videoId={this.props.videoId}                  // defaults -> null
                    opts={{
                        playerVars: { // https://developers.google.com/youtube/player_parameters
                            autoplay: 1
                        }
                    }}
                    // onReady={func}                    // defaults -> noop
                    // onPlay={func}                     // defaults -> noop
                    // onPause={func}                    // defaults -> noop
                    // onEnd={func}                      // defaults -> noop
                    // onError={func}                    // defaults -> noop
                    // onStateChange={func}              // defaults -> noop
                    // onPlaybackRateChange={func}       // defaults -> noop
                    // onPlaybackQualityChange={func}    // defaults -> noop
                />
                <VideoControlComponent />
            </div>
        )
    }
}

export default VideoComponent;