import React, { Component } from 'react'
import ListTableComponent from './ListTableComponent';

export default class ListComponent extends Component {

    static defaultProps = {
        songList : [
            // {'song': 'song1', 'singer': 'singer1'},
            // {'song': 'song2', 'singer': 'singer2'},
            // {'song': 'song3', 'singer': 'singer3'}
        ]
    }
    
    render() {
        return (
            <div className='List'>
                <h5>{new Date().date_str()}</h5>
                <ListTableComponent songList={this.props.songList} />
            </div>
        )
    }
}
