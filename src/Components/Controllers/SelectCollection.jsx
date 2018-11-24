import React from 'react';
import { SelectInput } from '../BasicComponents';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { mapStateToProps, mapDispatchToProps } from '../../store/mapToProps/mapToProps_SelectCollection';
import PropTypes from 'prop-types';


class SelectCollection extends React.Component {
  render() {
    const collections = this.props.collections ? this.props.collections : [''];
    const defValue = this.props.collectionStore ? this.props.collectionStore : collections[0];
    return (
      <Grid className='keysTable'>
        <Row>
          <Col xs={12}>
            <div className='fieldTitle'>
              <p className='h7'>Collection</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {/* <ActionCollection change={this.props.change} /> */}
            <SelectInput
              inputId={this.props.inputRef}
              className={this.lineClass + ' inputSelect'}
              change={this.props.change}
              valueRange={collections}
              value={defValue}
            />
          </Col>
        </Row>

      </Grid>
    )
  }
}

SelectCollection.propTypes = {
  collections: PropTypes.array,
  collectionStore: PropTypes.string,
  inputRef: PropTypes.string,
  change: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectCollection);
