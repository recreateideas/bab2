import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps } from '../../store/mapToProps/mapToProps_Querybox';
import PropTypes from 'prop-types';

const Querybox = ({mongo_query}) => {
   return ( 
    <div className='querybox'>
       <h5> {mongo_query}
        </h5>
    </div>
   )
}

Querybox.propTypes = {
    mongo_query: PropTypes.string,
};

export default connect(mapStateToProps)(Querybox);
