import React, { Component } from 'react'
import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import { setVideoNum } from '../actions'

class ListTableComponent extends Component {

    componentDidUpdate(){
        if(!this.props.num && this.props.songList && this.props.songList.length){
            this.props.setVideoNum(1)
        }
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
                                return <tr key={index} onClick={() => this.props.setVideoNum(obj.num)} style={style}>
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
        setVideoNum: (num) => dispatch(setVideoNum(num))
    }
}

ListTableComponent = connect(undefined, mapDispatchToProps)(ListTableComponent);

export default ListTableComponent