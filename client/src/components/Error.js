import React from 'react';
import { connect } from 'react-redux';
import { setError } from '../actions/error';

const Error = (props) => {
    return (
        <div className='error-container'>
            { props.error && 
                <div className='error'>
                    <h4 style={{color: 'red'}}>{props.error}</h4>
                </div>
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        error: state.error
    }
}

const mapDispatchToProps = { setError }

export default connect(mapStateToProps, mapDispatchToProps)(Error);