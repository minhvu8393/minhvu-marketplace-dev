import React from 'react';
import { connect } from 'react-redux';
import { setPostsList, resetPostList } from '../../client/src/actions/post';
import Post from './Post';
import { filterByStartPrice } from '../../client/src/actions/filter';
import imagesLoaded from 'imagesloaded';

class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            skip: 0,
        }
        this.fetchMoreData = this.fetchMoreData.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }
    componentDidMount() {
        window.addEventListener('scroll', this.onScroll)
        let { category, startprice, endprice } = this.props
        let url = `/api/posts?
                &limit=20
                &skip=${this.state.skip}
                ${category ? `&category=${category}`: ''}
                ${startprice ? `&startprice=${startprice}` : ''}
                ${endprice ? `&endprice=${endprice}` : ''}
                `
        fetch(url)
        .then(response => {
            return response.json()
        })
        .then(result => {
            console.log(result);
            this.props.setPostsList(result.posts);
            this.handleResizeGrid(); 
            this.setState(() => {
                return {
                    total: result.count
                }
            })
        })
    }
    fetchMoreData() {
        let { category, startprice, endprice } = this.props
        let url = `/api/posts?
        &limit=20
        &skip=${this.state.skip+20}
        ${category ? `&category=${category}`: ''}
        ${startprice ? `&startprice=${startprice}` : ''}
        ${endprice ? `&endprice=${endprice}` : ''}
        `
        fetch(url)
        .then(response => {
            return response.json()
        })
        .then(result => {
            console.log(result);
            this.props.setPostsList(result.posts);
            this.handleResizeGrid(); 
            this.setState((prevState) => {
                return {
                    skip: prevState.skip+20
                }
            })
        })
    }
    onScroll = () => {
        if (document.documentElement.scrollTop + window.innerHeight == document.body.clientHeight) {
            this.fetchMoreData();
        }

    }
    handleResizeGrid() {
        function resizeGridItem(item){
            let grid = document.getElementsByClassName("grid")[0];
            let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
            let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
            let rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
            item.style.gridRowEnd = "span "+rowSpan;
         }       
        function resizeAllGridItems(){
            let allItems = document.getElementsByClassName("post");
            for(let x=0;x<allItems.length;x++){
               resizeGridItem(allItems[x]);
            }
        }
        let allItems = document.getElementsByClassName("post");
        for(let x=0;x<allItems.length;x++){
            imagesLoaded( allItems[x], resizeInstance);
        }
        function resizeInstance(instance){
            let item = instance.elements[0];
            resizeGridItem(item);
        }
        window.addEventListener("resize", resizeAllGridItems);
    }
    componentWillUnmount() {
        this.props.resetPostList();
    }
    render() {
        return (
            <div>
                {console.log(this.state.skip)}
                <button onClick={this.fetchMoreData}>Fetch More</button>
                <div className='grid'>
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
        posts: state.posts
    }
}

const mapDispatchToProps = { setPostsList, resetPostList, filterByStartPrice };

export default connect(mapStateToProps, mapDispatchToProps)(Posts);