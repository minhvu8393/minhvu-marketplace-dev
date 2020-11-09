import React from 'react';
import { connect } from 'react-redux';
import { switchOpen, setComponent, setPostDetailId } from '../../client/src/actions/modal'; 

class Post extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div onClick={() => {
                this.props.switchOpen(true);
                this.props.setComponent('PostDetail');
                this.props.setPostDetailId(this.props.post._id)
                }} className='post'>
                    <div className='content'>
                        <Img image={Buffer.from(this.props.post.images[0].image.data).toString('base64')}/>
                        <h2>{this.props.post.title}</h2>
                        <h4>${this.props.post.price}</h4>
                    </div>

            </div>
        )
    }
}

const Img = (props) => {
    return (
        <div className='post__image'>
            <img className='post__image__image' src={`data:image/jpeg;base64,${props.image}`} />
        </div>
    )
}

const setDispatchToProps = { switchOpen, setComponent, setPostDetailId };

export default connect(undefined, setDispatchToProps)(Post);