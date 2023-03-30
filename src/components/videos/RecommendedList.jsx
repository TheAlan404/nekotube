import React, { useContext } from 'react'
import { VideoContext } from '../../contexts/VideoContext';
import ListRenderer from './ListRenderer';

const RecommendedList = () => {
    let {
        recommended,
    } = useContext(VideoContext);

    return (
        <ListRenderer list={recommended || []} />
    )
}

export default RecommendedList
