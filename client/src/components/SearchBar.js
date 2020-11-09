import React from 'react';
import { connect } from 'react-redux';
import { filterBySearch } from '../actions/filter';
import { BsSearch } from 'react-icons/bs';
import { IconContext } from "react-icons";

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='search'>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    this.props.filterBySearch(e.target.search.value)
                    e.target.search.value = '';
                }}>
                    <IconContext.Provider value={{ color: "white", className: "search__icon", size: '2em' }}>
                    <div>
                        <BsSearch />
                    </div>
                    </IconContext.Provider>
                    <input name='search' className='search__input'></input>
                </form>
                
            </div>
        )
    }
}

const mapDispatchToProps = { filterBySearch };

export default connect(null, mapDispatchToProps)(SearchBar);