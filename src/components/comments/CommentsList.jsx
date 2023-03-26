import { Group, Text, Title } from '@mantine/core';
import React, { useContext } from 'react'
import { UIContext } from '../../contexts/UIContext';
import { VideoContext } from '../../contexts/VideoContext'
import ListRenderer from '../videos/ListRenderer'

const CommentsList = () => {
    let { comments } = useContext(VideoContext);

    return (
        <>
            <ListRenderer list={comments} />
        </>
    )
}

export default CommentsList
