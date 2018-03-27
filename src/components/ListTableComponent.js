import React, { Component } from 'react'
import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import { setVideoId } from '../actions'

class ListTableComponent extends Component {

    componentDidUpdate(){
        if(!this.props.num && this.props.songList && this.props.songList.length){
            this.changeSong(this.props.songList[0])
        }
    }
    
    changeSong(obj) {
        console.log('clicked', obj, obj.yymmddhh, obj.num)

        fetch(`song/change?yymmddhh=${obj.yymmddhh}&num=${obj.num}`)
            .then(res => res.json())
            .then(result => {
                console.log('result', result)
                this.props.setId(result.url, obj.singer, obj.song, obj.num)
                document.title = `${obj.singer} - ${obj.song}`
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
                                let style = {
                                    backgroundColor : obj.num === this.props.num ? 'rgba(0,0,0,.05)' : ''
                                }
                                return <tr key={index} onClick={() => this.changeSong(obj)} style={style}>
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
        setId: (videoId, singer, song, num) => dispatch(setVideoId(videoId, singer, song, num))
    }
}

ListTableComponent = connect(undefined, mapDispatchToProps)(ListTableComponent);

export default ListTableComponent