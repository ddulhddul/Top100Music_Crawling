import React, { Component } from 'react'
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import { IoStop, IoIosFastforward, IoIosPlay } from 'react-icons/lib/io'
import { FaRefresh, FaRandom } from 'react-icons/lib/fa'

export default class VideoControlComponent extends Component {

    render() {
        return (
            <div className='VideoControl'>
                <ButtonToolbar>
                    <ButtonGroup className="btnGrp">
                        <Button color="default"><b>1</b></Button>
                        <Button color="info"><FaRefresh /></Button>
                        <Button color="default"><FaRandom /></Button>
                    </ButtonGroup>

                    <ButtonGroup className="btnGrp">
                        <Button color="warning"><IoStop /></Button>
                        <Button color="primary"><IoIosPlay /></Button>
                        <Button color="danger"><IoIosFastforward /></Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </div>
        )
    }
}
