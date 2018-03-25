import React, { Component } from 'react'
import VideoControlComponent from './VideoControlComponent'
import ResponsiveEmbed from 'react-responsive-embed'

export default class VideoComponent extends Component {
    
    static defaultProps = {
        videoId : 'vecSVX1QYbQ'
    }

    render() {
        return (
            <div className='Video'>
                <h4>Song Singer</h4>
                <ResponsiveEmbed src={'https://www.youtube.com/embed/'+this.props.videoId} ratio='4:3' />
                <VideoControlComponent />
            </div>
        )
    }
}
