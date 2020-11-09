import React, { useState } from 'react';

export const UploadImagesStage = (props) => {
    const [images, setImages ] = useState([])
    return (
        <div className='createpost__stage-uploadimages'>
            <div className='createpost__stage-uploadimages__title'>
                <h1>Upload images for your post</h1>
                <hr style={{width: '250px'}}></hr>
            </div>
            <div>
                <input type='file' multiple onChange={(e) => {
                    const validFile = ['image/jpeg', 'image/jpg', 'image/png']
                    let filesAreValid = true;
                    for ( let i = 0; i < e.target.files.length; i++) {
                        if (!validFile.includes(e.target.files[i].type)) {
                            filesAreValid = false;
                        }
                    }
                    if (props.totalImages + e.target.files.length < 7 && filesAreValid) {
                        props.setError('')
                        let arrayOfImages = []
                        for (let i = 0; i < e.target.files.length; i++) {
                            arrayOfImages = arrayOfImages.concat(URL.createObjectURL(e.target.files[i]))
                        }
                        setImages(arrayOfImages);
                        props.setImagesToState(e.target.files)
                    } else {
                        e.target.value = null
                        if (!filesAreValid) {
                            return props.setError('Valid file types: jpeg, jpg, png');
                        }
                        props.setError('Max Images: 6')
                        
                    }
                }}/>
                <h5>(Max: 6 images, 5mb each)</h5>
            </div>
            <div className='createpost__stage-uploadimages__images'>
                { images.map((image, index) => {
                    return <div key={index} className='createpost__stage-uploadimages__images__image'><img src={image}/></div>
                }) }

            </div>
        </div>
    )
}

export const PostInfoStage = (props) => {
    return (
        <div className='createpost__stage-postinfo'>
            <div className='createpost__stage-postinfo__field'>
                <p>Title: </p> 
                <input onChange={(e) => {
                    props.setInfoToState({postTitle: e.target.value})
                }}/>
            </div>
            <div className='createpost__stage-postinfo__field'>
                <p>Description: </p> 
                <textarea rows={10} onChange={(e) => {
                    props.setInfoToState({postDescription: e.target.value})
                }}/>
            </div>
            <div className='createpost__stage-postinfo__field'>
                <p>Price: </p>
                <input onChange={(e) => {
                    props.setInfoToState({postPrice: e.target.value})
                }}/>
            </div>
            <div className='createpost__stage-postinfo__field'>
                <p>Category: </p>
                <select onChange={(e) => {
                    props.setInfoToState({postCategory: e.target.value})
                }}>
                    <option value={undefined} defaultValue>category</option>
                    <option value='phone'>Phone</option>
                    <option value='tablet'>Tablet</option>
                    <option value='laptop'>Laptop</option>
                    <option value='gameconsole'>Game Console</option>
                </select>
            </div>
        </div>
    )
}

export const ReviewPost = (props) => {
    return (
        <div>
            <div>
                {props.images.map((image) => {
                    <img src={`data:image/jpeg;base64,${image}`}/>
                })}
            </div>
            <div>
                <h1>Title: {props.title}</h1>
                <h3>Price: {props.price}</h3>
                <h3>Description: {props.description}</h3>
            </div>
        </div>
    )
}