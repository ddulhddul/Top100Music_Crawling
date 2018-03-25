import React, { Component } from 'react'
import { Table } from 'reactstrap';

export default class ListTableComponent extends Component {
    
    render() {
        return (
            <div className='ListTable' style={{height:'500px', overflowY:'auto'}}>
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
                                return <tr key={index}>
                                    <td>{index+1}</td>
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
