import React from 'react';
import { connect } from 'react-redux';
import { switchOpen, setComponent, setPostDetailId} from '../actions/modal';

const RelativePosts = (props) => {
    const openPostDetail = () => {
        props.setPostDetailId(props.post._id);
        props.setComponent('PostDetail');
        props.switchOpen(true);
    }
    return (
        <div className='relativepost-container'>
            <div onClick={() => {
                openPostDetail();
            }} className='relativepost'>
                <div className='relativepost__image'>
                    <img src={`data:image/jpge;base64,${props.post.thumbnail}`}/>
                </div>
                <div className='relativepost__info'>
                    <h3>{props.post.title}</h3>
                    <h4>{`${new Date(props.post.createdAt).getDate()} - ${new Date(props.post.createdAt).getMonth()} - ${new Date(props.post.createdAt).getFullYear()}`}</h4>
                </div>
            </div>
        </div>
    )
}

const mapDispatchToProps = { switchOpen, setComponent, setPostDetailId }

export default connect(null, mapDispatchToProps)(RelativePosts);