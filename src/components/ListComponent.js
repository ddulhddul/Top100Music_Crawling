import React, { Component } from 'react'
import ListTableComponent from './ListTableComponent';

export default class ListComponent extends Component {

    render() {
        return (
            <div className='List'>
                <h6>
                    <div style={{float:'left', display: 'inline-block', width: '33%'}}>
                        Select
                    </div>
                    <div style={{display: 'inline-block', width: '33%', textAlign: 'center'}}>
                        {String(this.props.yymmddhh).replace(/(.{4})(.{2})(.{2})(.{2})/, '$1-$2-$3 $4:00')}
                    </div>
                    <div style={{float:'right', display: 'inline-block', width: '33%', textAlign: 'right'}}>
                        Today
                    </div>
                </h6>
                <ListTableComponent 
                    songList={this.props.songList}
                    num={this.props.num} 
                />
            </div>
        )
    }
}
