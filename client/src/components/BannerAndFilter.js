import React from 'react';
import { connect } from 'react-redux';
import { filterByStartPrice, filterByEndPrice, filterByCategory, filterByRecent } from '../actions/filter';

const BannerAndFilter = (props) => {
    return (
        <div className='bannerandfilter-container'>
            <div className='bannerandfilter'>
                <Banner />
                <Filter
                    filterByStartPrice={props.filterByStartPrice}
                    filterByEndPrice={props.filterByEndPrice}
                    filterByRecent={props.filterByRecent}
                    filterByCategory={props.filterByCategory}
                />
            </div>
        </div>
    )
}

const Banner = () => {
    return (
        <div className='bannerandfilter__banner'></div>
    )
}

const Filter = (props) => {
    const setStartPrice = (value) => {
        props.filterByStartPrice(value);
    }
    const setEndPrice = (value) => {
        props.filterByEndPrice(value);
    }
    const setCategory = (value) => {
        props.filterByCategory(value);
    }
    const setRecent = (value) => {
        props.filterByRecent(value);
    }
    return (
        <div className='bannerandfilter__filter'>
                <select onChange={(e) => {setStartPrice(e.target.value)}} name='startPrice'>
                    <option value={''} defaultValue={true}>Start Price</option>
                    <option value={200}>$200</option>
                    <option value={400}>$400</option>
                    <option value={600}>$600</option>
                    <option value={800}>$800</option>
                    <option value={1000}>$1000</option>
                </select>
                <select onChange={(e) => {setEndPrice(e.target.value)}} name='endPrice'>
                    <option value={''} defaultValue={true}>End Price</option>
                    <option value={300}>$300</option>
                    <option value={500}>$500</option>
                    <option value={700}>$700</option>
                    <option value={900}>$900</option>
                    <option value={1100}>$1100</option>
                </select>
                <select onChange={(e) => {setRecent(e.target.value)}} name='recent'>
                    <option value={''} defaultValue={true}>Recent Posts</option>
                    <option value={3}>3 days ago</option>
                    <option value={7}>7 days ago</option>
                    <option value={30}>30 days ago</option>
                </select>
                <select onChange={(e) => {setCategory(e.target.value)}} name='category'>
                    <option value={''} defaultValue={true}>All category</option>
                    <option value={'phone'}>Phone</option>
                    <option value={'tablet'}>Tablet</option>
                    <option value={'laptop'}>Laptop</option>
                    <option value={'gameconsole'}>Game Console</option>
                </select>
        </div>
    )
}

const mapDispatchToProps = { filterByStartPrice, filterByEndPrice, filterByRecent, filterByCategory }

export default connect(null, mapDispatchToProps)(BannerAndFilter);