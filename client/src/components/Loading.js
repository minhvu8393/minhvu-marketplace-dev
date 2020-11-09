import React from 'react';
import loadingGif from './loading.gif'

const Loading = (props) => {
    return (
        <div className='loading'>
            <img src={loadingGif}/>
        </div>
    )
}

export default Loading;