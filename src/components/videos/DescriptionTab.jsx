import React, { useContext } from 'react'
import DescriptionRenderer from './DescriptionRenderer'
import { VideoContext } from '../../contexts/VideoContext'

const DescriptionTab = () => {
    let { description } = useContext(VideoContext);

    return (
        <DescriptionRenderer description={description} />
    );
}

export default DescriptionTab
