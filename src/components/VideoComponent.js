import React, { Component } from 'react'
import VideoControlComponent from './VideoControlComponent'
import YoutubePlayer from 'react-youtube-player';

export default class VideoComponent extends Component {
    
    static defaultProps = {
        videoId : 'vecSVX1QYbQ'
    }

    render() {
        return (
            <div className='Video'>
                <h4>Song Singer</h4>
                <div style={{height:'400px', width:'550px'}}>
                    <YoutubePlayer
                        videoId={this.props.videoId}
                        playbackState='unstarted'
                        configuration={
                            {
                                showinfo: 0,
                                controls: 0
                            }
                        }
                    />
                    <VideoControlComponent />
                </div>
            </div>
        )
    }
}
