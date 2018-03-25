import React, { Component } from 'react'
import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import { setVideoId } from '../actions'

class ListTableComponent extends Component {

    changeSong(obj) {
        console.log('clicked', obj, obj.yymmddhh, obj.num)

        fetch(`song/change?yymmddhh=${obj.yymmddhh}&num=${obj.num}`)
            .then(res => res.json())
            .then(result => {
                console.log('result', result)
                this.props.setId(result.url, obj.singer, obj.song)
            })
    }

    render() {
        return (
            <div className='ListTable' style={{ height: '500px', overflowY: 'auto' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Song</th>
                            <th>Singer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.songList.map((obj, index, array) => {
                                return <tr key={index} onClick={() => this.changeSong(obj)}>
                                    <td>{index + 1}</td>
                                    <td>{obj.song}</td>
                                    <td>{obj.singer}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </Table>
            </div>
        )
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        setId: (videoId, singer, song) => dispatch(setVideoId(videoId, singer, song))
    }
}

ListTableComponent = connect(undefined, mapDispatchToProps)(ListTableComponent);

export default ListTableComponent