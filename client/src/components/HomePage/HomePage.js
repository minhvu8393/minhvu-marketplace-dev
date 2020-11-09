import React from 'react';
import Posts from './Posts';
import { connect } from 'react-redux';
import { setPostsList, resetPostList } from '../../actions/post';

class HomePage extends React.Component {
    constructor(props){
        super(props);
        this.fetchMoreData = this.fetchMoreData.bind(this);
    }
    componentDidMount() {
        let { category, startPrice, endPrice, search } = this.props.filters;
        let url = `/api/posts?
        &limit=20
        &skip=0
        ${search ? `&search=${search}` : ''}
        `
        console.log(url);
        fetch(url)
        .then(response => response.json())
        .then(result => {
            this.props.setPostsList(result.posts)
        })
    }
    componentDidUpdate(prevProps) {
        let { category, startPrice, endPrice, recent, search } = prevProps.filters;
        let { category: thisCategory, startPrice: thisStartPrice, endPrice: thisEndPrice, recent: thisRecent, search: thisSearch } = this.props.filters;
        console.log(this.props.filters.category)
        console.log(category, thisCategory)
        if (category !== thisCategory || startPrice !== thisStartPrice || endPrice !== thisEndPrice || recent !== thisRecent || search !== thisSearch) {
            this.props.resetPostList();
            let url = `/api/posts?
            &limit=20
            &skip=0
            ${thisCategory ? `&category=${thisCategory}`: ''}
            ${thisStartPrice ? `&startprice=${thisStartPrice}` : ''}
            ${thisEndPrice ? `&endprice=${thisEndPrice}` : ''}
            ${thisRecent ? `&recent=${thisRecent}`: ''}
            ${thisSearch ? `&search=${thisSearch}` : ''}
            `
            console.log(url);
            fetch(url)
            .then(response => response.json())
            .then(result => {
                this.props.setPostsList(result.posts)
            })
        }
    }
    fetchMoreData() {
        let { category, startPrice, endPrice, recent, search } = this.props.filters;
        let url = `/api/posts?
        &limit=20
        &skip=${this.props.posts.length + 20}
        ${category ? `&category=${category}`: ''}
        ${startPrice ? `&startprice=${startPrice}` : ''}
        ${endPrice ? `&endprice=${endPrice}` : ''}
        ${recent ? `&recent=${recent}`: ''}
        ${search ? `&search=${search}` : ''}
        `
        console.log(url);
        fetch(url)
        .then(response => response.json())
        .then(result => {
            this.props.setPostsList(result.posts)
        })
    }
    componentWillUnmount() {
        this.props.setPostsList([]);
    }
    render() {
        return (
            <div>
                <Posts fetchMoreData={this.fetchMoreData}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        filters: state.filters,
        posts: state.posts
    }
}

const mapDispatchToProps = { setPostsList, resetPostList };

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);