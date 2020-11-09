import React from 'react';
import { connect } from 'react-redux';
import { switchOpen, setComponent, setPostDetailId } from '../../actions/modal'; 

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
                }} className='posts__post'>
                    <div className='post__content'>
                        <Img image={this.props.post.thumbnail}/>
                        <h2 style={{padding: '0px 10px'}}>{this.props.post.title}</h2>
                        <h4>${this.props.post.price}</h4>
                        { Math.ceil((new Date().getTime() - new Date(this.props.post.createdAt).getTime()) / 86400000) > 1 ?
                        <h5>{Math.ceil((new Date().getTime() - new Date(this.props.post.createdAt).getTime()) / 86400000)} days ago</h5>
                        :
                        <h5>1 day ago</h5>
                        }
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