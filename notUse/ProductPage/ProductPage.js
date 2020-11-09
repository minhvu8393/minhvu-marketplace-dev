import React from 'react';
import { connect } from 'react-redux';
import Posts from './Posts';
import queryString from 'query-string';
import { filterByEndPrice, filterByStartPrice } from '../../client/src/actions/filter';
import { switchOpen, setComponent, setPostDetailId } from '../../client/src/actions/modal';

class ProductPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ...queryString.parse(this.props.location.search),
            renderPosts: true,
        }
        this.handleRenderingPosts = this.handleRenderingPosts.bind(this);
        this.handleFilterByStartPrice = this.handleFilterByStartPrice.bind(this);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (queryString.parse(nextProps.location.search).category !== prevState.category) {
            return {
                ...queryString.parse(nextProps.location.search),
                renderPosts: !prevState.renderPosts
            }
        } else {
            return null
        }
    }
    handleRenderingPosts(prevState) {
        this.setState(() => {
            return {
                renderPosts: !prevState.renderPosts
            }
        })
    }
    handleFilterByStartPrice(e) {
        this.props.filterByStartPrice(e.target.value);
        this.handleRenderingPosts();
    }
    render() {
        return (
            <div>
                {   
                    this.state.renderPosts &&
                    <div>                       
                        <Posts 
                            handleRenderingPosts={this.handleRenderingPosts}
                            category={this.state.category}
                            startprice={this.props.filters.startPrice}
                            endPrice={this.props.filters.endPrice}
                        />
                    </div>
                }
                {   
                    !this.state.renderPosts &&
                    <div>                       
                        <Posts 
                            handleRenderingPosts={this.handleRenderingPosts}
                            category={this.state.category}
                            startprice={this.props.filters.startPrice}
                            endPrice={this.props.filters.endPrice}
                        />
                    </div>
                }
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        filters: state.filters
    }
}

const mapDispatchToProps = { filterByStartPrice, filterByEndPrice, switchOpen, setComponent, setPostDetailId }

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)