import React from 'react';
import { connect } from 'react-redux';
import { setPostsList, resetPostList } from '../../actions/post';
import Post from './Post';
import { filterByStartPrice } from '../../actions/filter';
import imagesLoaded from 'imagesloaded';

class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.onScroll = this.onScroll.bind(this);
        this.resizeAllPosts = this.resizeAllPosts.bind(this);
        this.resizeSinglePost = this.resizeSinglePost.bind(this);
    }
    componentDidMount() {
        window.addEventListener('scroll', this.onScroll)
        window.addEventListener('resize', this.resizeAllPosts)
    }
    componentDidUpdate(prevProps) {
        if (prevProps.posts.length !== this.props.posts.length) {
            let allPosts = document.getElementsByClassName('posts__post');
            for (let i = allPosts.length - 20; i < allPosts.length; i++) {
                imagesLoaded(allPosts[i], (instance) => {
                    let post = instance.elements[0];
                    this.resizeSinglePost(post);
                })
            }
        }
    }
    onScroll = () => {
        if (document.documentElement.scrollTop + window.innerHeight == document.body.clientHeight) {
            this.props.fetchMoreData();
        }
    }
    resizeSinglePost(post) {
        let postsGrid = document.getElementsByClassName('posts__grid')[0];
        let gridRowHeight = parseInt(window.getComputedStyle(postsGrid).getPropertyValue('grid-auto-rows'));
        let gridRowGap = parseInt(window.getComputedStyle(postsGrid).getPropertyValue('grid-row-gap'));
        let gridRowSpan = Math.ceil((post.querySelector('.post__content').getBoundingClientRect().height + gridRowGap) / (gridRowHeight + gridRowGap));
        post.style.gridRowEnd = `span ${gridRowSpan}`;
    }
    resizeAllPosts() {
        let allPosts = document.getElementsByClassName('posts__post');
        for (let i = 0; i < allPosts.length; i++) {
            this.resizeSinglePost(allPosts[i])
        }
    }
    componentWillUnmount() {
        this.props.resetPostList();
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.resizeAllPosts);
    }
    render() {
        return (
            <div>
                <div className='posts__grid'>
                    {
                        this.props.posts.map((post, index) => {
                            return <Post post={post} key={index} />
                        })
                    }

                </div>
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        posts: state.posts,
    }
}

const mapDispatchToProps = { setPostsList, resetPostList, filterByStartPrice };

export default connect(mapStateToProps, mapDispatchToProps)(Posts);