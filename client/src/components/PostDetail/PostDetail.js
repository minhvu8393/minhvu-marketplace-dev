import React from 'react';
import Images from './Images';
import Information from './Information';
import  { connect } from 'react-redux';

class PostDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: false,
            images: [],
        }
    }
    componentDidMount() {
        let id = this.props.id;
        fetch(`/api/post/${id}`)
        .then(response => response.json())
        .then(result => {
            let images = [];
            result.post.images.map((image, index) => {
                images.push({
                    id: index,
                    data: Buffer.from(image.image.data)
                    })
                }
            )
            delete result.post.images;
            this.setState(() => {
                return {
                    post: result,
                    images: images,
                }
            })
        })
    }
    render() {
        return (
            <div className='postdetail'>
                {this.state.post &&
                    <div className='postdetail-container'>
                        <div className='postdetail__images'>
                            <Images images={this.state.images}/>
                        </div>
                        <div>
                            <Information title={this.state.post.post.title} 
                            description={this.state.post.post.description}
                            price={this.state.post.post.price} 
                            user={this.state.post.user}
                        />
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        modal: state.modalReducer
    }
}

export default connect(mapStateToProps)(PostDetail);