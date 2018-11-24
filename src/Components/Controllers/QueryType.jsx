import React from 'react';
import { SelectInput } from '../BasicComponents';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { mapStateToProps } from '../../store/mapToProps/mapToProps_QueryType';
import PropTypes from 'prop-types';

class QueryType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayDistinct: 'display_none'
        }
    }

    render() {
        return (
            <Grid className='keysTable'>
                <Row>
                    <Col xs={12}><div className='fieldTitle'><p className='h7'>Query Type: {this.props.storeQueryType}</p></div></Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <SelectInput
                            inputId='change_query_type'
                            className='inputSelect largeSelect'
                            change={this.props.change}
                            valueRange={this.props.valueArray}
                            value={this.props.storeQueryType}
                        />
                    </Col>
                </Row>
            </Grid>
        )
    }
}

QueryType.propTypes = {
    change: PropTypes.func,
    valueArray: PropTypes.array,
    storeQueryType: PropTypes.string,
    queryType: PropTypes.string,
}

export default connect(mapStateToProps)(QueryType); 
