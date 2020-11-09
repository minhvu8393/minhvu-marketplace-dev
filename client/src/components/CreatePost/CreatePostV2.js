import React from 'react';
import { setComponent, setPostDetailId } from '../../actions/modal';
import { connect } from 'react-redux';
import { UploadImagesStage, PostInfoStage, ReviewPost} from './Stages';
import { setError } from '../../actions/error';
import Loading from '../Loading';
import Error from '../Error';

class CreatePost extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            stage: 1,
            mapId: (new Date().getTime()).toString(),
            images: [],
            totalImages: 0,
            uploadedImages: [],
            postTitle: undefined,
            postDescription: undefined,
            postPrice: undefined,
            postCategory: undefined,
        }
        this.nextStage = this.nextStage.bind(this);
        this.previousStage = this.previousStage.bind(this);
        this.setImagesToState = this.setImagesToState.bind(this);
        this.setInfoToState = this.setInfoToState.bind(this);
        this.handleUploadImages = this.handleUploadImages.bind(this);
        this.handleCreatePost = this.handleCreatePost.bind(this);
        this.setNewUploadedImages = this.setNewUploadedImages.bind(this);
    }
    nextStage() {
        if (this.state.stage === 1) {
            this.handleUploadImages();
        }
        if (this.state.stage < 3) {
            this.setState((prevState) => {
                return {
                    stage: prevState.stage + 1
                }
            })
        }
    }
    previousStage() {
        if (this.state.stage > 1) {
            this.setState((prevState) => {
                return {
                    stage: prevState.stage - 1
                }
            })
        }
    }
    setImagesToState(images) {
        this.setState(() => ({images}))
    }
    setInfoToState(info) {
        this.setState(() => info)
    }
    handleUploadImages() {
        let images = [...this.state.images]
        this.setState((prevState) => {
            return {
                totalImages: prevState.images.length + prevState.totalImages,
                images: []
            }
        })
        for ( let i = 0; i < images.length; i++) {
            let formData = new FormData();
            formData.append('mapId', this.state.mapId)
            formData.append('image', images[i])
            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            .then (response => {
                if (response.status === 201) {
                    response.json()
                    .then(result => {
                        if (result.thumbnail) {
                            this.setState((prevState) => {
                                return {
                                    uploadedImages: prevState.uploadedImages.concat({
                                        image: Buffer.from(result.thumbnail.data).toString('base64'),
                                        id: result._id
                                    })
                                }
                            })    
                        }
                    })
                } else {
                    response.json()
                    .then(result => {
                        this.props.setError(result.error)
                    })
                }
            })
        }
    }
    setNewUploadedImages(newUploadedImages) {
        this.setState((prevState) => {
            return {
                uploadedImages: [...newUploadedImages],
                totalImages: prevState.totalImages - 1
            }
        })
    }
    handleCreatePost() {
        let { mapId, postTitle: title, postDescription: description, postPrice: price, postCategory: category } = this.state;
        let body = {
            mapId,
            title,
            description,
            price,
            category
        }
        fetch('/api/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            if (response.status === 201) {
                response.json()
                .then(result => {
                    if (result._id) {
                        this.props.setPostDetailId(result._id);
                        this.props.setComponent('PostDetail');                
                    }
                })
            } else {
                response.json()
                .then(result => {
                    this.props.setError(result.error);
                })
            }
        })


    }
    componentWillUnmount() {
        this.props.setError('');
        fetch(`/api/upload/deleteall/${this.state.mapId}`, {method: 'DELETE'})
        .then(response => console.log(response.status))
    }
    render() {
        return (
            <div className='createpost-container'>
                <div className='createpost'>
                    <div className='createpost__nextprevious'>
                        <button onClick={this.previousStage}>{'< Back'}</button>
                        {this.state.stage !== 3 ?
                            <button onClick={this.nextStage}>{'Next >'}</button>
                            :
                            <button onClick={this.handleCreatePost}>Create Post</button>
                        }
                        {console.log('THIS STATE: ', this.state)}
                    </div>
                    <div className='createpost__uploadedimages'>
                        <UploadedImages
                            images={this.state.uploadedImages} 
                            totalImages={this.state.totalImages}
                            setNewUploadedImages={this.setNewUploadedImages}
                        />
                    </div>
                    <div className='createpost__stages'>
                        {this.state.stage === 1 &&
                            <UploadImagesStage 
                                setError={this.props.setError} 
                                setImagesToState={this.setImagesToState} 
                                totalImages={this.state.totalImages}
                            />
                        }
                        {this.state.stage === 2 &&
                            <PostInfoStage setInfoToState={this.setInfoToState}/>
                        }
                        {this.state.stage === 3 &&
                            <ReviewPost 
                                images={this.state.uploadedImages} 
                                title={this.state.postTitle}
                                description={this.state.postDescription}
                                price={this.state.postPrice}
                            />
                        }
                    </div>
                    <Error />
                </div>
            </div>

        )
    }
}

const UploadedImages = (props) => {
    const deleteThisImage = (id) => {
        fetch(`/api/upload/delete/${id}`, {method: 'DELETE'})
        .then(response => {
            if (response.status === 200) {
                console.log(response.status, 'DELETED')
                let newUploadedImages = props.images.filter((image) => {
                    return image.id !== id
                })
                props.setNewUploadedImages(newUploadedImages);
            }
        });
    }
    return (
        <div className='createpost__uploadedimages__images'>
            {props.images.length < props.totalImages &&
                <Loading />
            }
            {props.images.map((image, index) => {
                let imageId = image.id;
                return  <div onClick={() => {
                    deleteThisImage(imageId);
                }} key={index} className='createpost__uploadedimages__images__image'>
                            <div>
                                <div className='createpost__uploadedimages__images__deleteoverlay'><p>X</p></div>
                                <img src={`data:image/jpeg;base64,${image.image}`}/> 
                            </div>
                        </div>
            })}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = { setComponent, setPostDetailId, setError }

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);