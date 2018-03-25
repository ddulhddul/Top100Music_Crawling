import React, { Component } from 'react'
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';

export default class VideoControlComponent extends Component {

    render() {
        return (
            <div className='VideoControl'>
                <ButtonToolbar>
                    <ButtonGroup className="btnGrp">
                        <Button color="default">1</Button>
                        <Button color="info">Seq</Button>
                        <Button color="default">Rand</Button>
                    </ButtonGroup>

                    <ButtonGroup className="btnGrp">
                        <Button color="warning">Pause</Button>
                        <Button color="primary">Start</Button>
                        <Button color="danger">FF</Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </div>
        )
    }
}
