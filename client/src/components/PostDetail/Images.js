import React from 'react';

class Images extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            largeImage : this.props.images[0]
        }
        this.handleSetLargeImage = this.handleSetLargeImage.bind(this);
    }
    handleSetLargeImage(image) {
        this.setState(() => {
            return {
                largeImage: image
            }
        })
    }
    render() {
        return (
            <div>
                <div className='post__largeimage'>
                    <img className='post__largeimage__image' src={`data:image/jpeg;base64,${this.state.largeImage.data.toString('base64')}`} />
                </div>
                <Thumbnails largeImageId={this.state.largeImage.id} handleSetLargeImage={this.handleSetLargeImage} images={this.props.images} />
            </div>
        )
    }
}

const Thumbnails = (props) => {
    return (
        <div className='thumbnails'>
            {props.images.map((image, index) => {
                return <Thumbnail largeImageId={props.largeImageId} handleSetLargeImage={props.handleSetLargeImage} key={index} image={image}/>
            })}
        </div>
    )
}

const Thumbnail = (props) => {
    return (
        <div className='thumbnail'>
            <img 
                className={props.image.id === props.largeImageId ? 'thumbnail__image-active' : 'thumbnail__image'}
                id={props.image.id}
                onClick={() => {
                    props.handleSetLargeImage({id: props.image.id, data: props.image.data})
                }}
                src={`data:image/jpeg;base64,${props.image.data.toString('base64')}`}
            />
        </div>
    )
}

export default Images;