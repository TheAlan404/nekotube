import React from 'react'
import { ControlsContext } from '../contexts/ControlsContext'

const ControllableList = (props) => {

    return (
        <ControlsContext.Provider value={{}}>
            {props.children}
        </ControlsContext.Provider>
    )
}

export default ControllableList
