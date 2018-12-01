import React from 'react';
import { connect } from 'react-redux'
import { Querybox, Cursor, QueryType, Stage, SelectCollection, Interrogator, Loader } from '../../../Components';
import { Grid, Row, Col } from 'react-bootstrap';
import { mapStateToProps, mapDispatchToProps } from '../../../store/mapToProps/mapToProps_QueryTab';
import { getElementsFromConfig, findStageValuesFromConfig, parsePreParamsSyntax } from '../../../configuration/configHelpers/queryHelpers';
import PropTypes from 'prop-types';

const configJSON = require('../../../configuration/config.json');


class QueryTab extends React.Component {

    componentWillMount() {
        this.config = configJSON;
        this.config.queries = parsePreParamsSyntax(this.config);
        this.props.setConfigQueriesToStore(this.config.queries);
        this.initializeQueryCollectionState();
    }

    initializeQueryCollectionState() {
        const queryCollectionState = this.props.storeQueryCollectionState;
        let initObj = this.insertCollectionStateInObject(queryCollectionState, 'stage_1');
        return this.props.setQueryCollectionStateToStore(initObj);
    }

    insertCollectionStateInObject(object, stage) {
        object[stage] = Object.assign({}, this.props._collectionStateTemplate);
        return object;
    }

    updateQueryType(e) {
        const type = e.target.value;
        const stateQuery = this.props.storeQuery;
        const format = this.props.storeConfig.queries[type];
        const formatStages = format.stages;
        let collection = this.props.storeQueryCollectionState;
        stateQuery.stages = {};
        Object.keys(formatStages).forEach(stage => {
            let stateStage = stateQuery.stages[stage];
            if (!stateStage) { //need to create a collection field and a query field
                stateStage = formatStages[stage];
                if (!collection[stage]) {
                    collection[stage] = JSON.parse(JSON.stringify(this.props._stageTemplate));
                }
            }
            else Object.keys(formatStages[stage]) //maps to the config stage
                .map((key) => stateStage[key] = (formatStages[stage][key] ? formatStages[stage][key] : ''));
            stateStage.isActive = (formatStages[stage].isActive ? formatStages[stage].isActive : true);
            stateQuery.stages[stage] = stateStage;
        })
        stateQuery.openQuery = format.openQuery; //  sets the openQuery according to config 
        stateQuery.closeQuery = format.closeQuery; //sets the closeQuery according to config
        stateQuery.queryType = type;
        this.props.setQueryValuesToStore(stateQuery);
        this.updateQueryCollectionPreStages(collection);
    }

    updateQueryCollectionPreStages(collectionStages) {
        let stages = this.props.storeQuery.stages;
        Object.keys(stages).forEach((stage) => {
            console.log(stages[stage].preParams);
            if (collectionStages[stage] && stages[stage]) {
                collectionStages[stage].preStage = stages[stage].preParams;
            }
        });
        this.props.setQueryCollectionStateToStore(collectionStages);
    }

    updateCollection(e) {
        // const collection = e.target.value;
        let query = Object.assign({}, this.props.storeQuery);
        query.collection = e.target.value;
        // this.props.setCollectionToStore(collection);
        this.props.setQueryValuesToStore(query);
    }

    removeStage(name) {
        let stages = {}, collection = {};
        const newStateQuery = Object.assign({}, this.props.storeQuery);
        let newStateCollection = Object.assign({}, this.props.storeQueryCollectionState);
        delete newStateQuery.stages[name];
        delete newStateCollection[name];
        Object.keys(newStateQuery.stages).map((stage, index) => {
            let stageLabel = 'stage_' + (parseFloat(index) + 1);
            stages[stageLabel] = Object.assign({}, newStateQuery.stages[stage]);
            return newStateCollection[stage] ? collection[stageLabel] = Object.assign({}, newStateCollection[stage]) : null;
        });
        newStateQuery.stages = stages;
        newStateCollection = collection;
        this.props.setQueryValuesToStore(newStateQuery);
        this.props.setQueryCollectionStateToStore(newStateCollection);
    }

    addStage(e) {
        const name = e.target.id.split('_')[2];
        const index = e.target.id.split('_')[3];
        const nextStage = name + '_' + (parseFloat(index) + 1);
        const queryType = this.props.storeQueryType;
        let newStateQuery = this.props.storeQuery;
        let newStateCollection = this.props.storeQueryCollectionState;
        newStateQuery.stages[nextStage] = this.props.storeConfig.queries[queryType].stages.stage_1;
        newStateCollection[nextStage] = JSON.parse(JSON.stringify(this.props._stageTemplate));
        // console.log(newStateCollection[nextStage]);
        this.props.setQueryValuesToStore(newStateQuery);
        this.props.setQueryCollectionStateToStore(newStateCollection);
        // console.log(_stageTemplate);
    }

    renderStages(key) {
        // console.log('QUERYTAB ->  renderStages');
        const stages = this.props.storeQuery.stages; //<--- change to this to make it work
        const collection = this.props.storeQueryCollectionState[key];
        const stageName = stages[key];
        const index = key.split('_')[1];
        return (
            <Stage
                key={key}
                stage={key}
                queryData={stageName}
                preValues={findStageValuesFromConfig(this.config, stageName)}
                isActive={collection.isActive}
                addStage={this.addStage.bind(this)}
                deleteStage={this.removeStage.bind(this)}
                index={index}
                preStage={collection.preStage}
                stageValues={collection.params}
            />
        );
    }

    render() {
        const stages = this.props.storeQuery.stages;
        const array = getElementsFromConfig(this.props.storeConfig, 'queries');
        return (
            <div id="queryTab" className="tab" >
                <div id='queryConnectionName'>
                    <div className='XLTitle'>{this.props.storeConnectionName}</div>
                </div>
                <div id='queryComponent'>
                    <Grid id='querySetupTable' className='keystable contentTable appContent'>
                        <Row>
                            <Col xs={6} className='selectcollectionWrapper'>
                                <SelectCollection id='selectcollection' change={this.updateCollection.bind(this)} />
                            </Col>
                            <Col xs={6} style={{width: 'fit-content'}}>
                                <QueryType
                                    id='querytype'
                                    change={this.updateQueryType.bind(this)}
                                    queryType={this.props.storeQueryType}
                                    valueArray={array} />
                            </Col>
                        </Row>
                    </Grid>
                    {Object.keys(stages).map(key => this.renderStages(key))} { /*store queries*/} { /*display results*/}
                    <Cursor id='cursorBox' />
                    <p id='queryBottomSpacer' />
                    <Loader loaderId='queryLoader' loaderType='ThreeDots' addClass='fullPage'/>
                    <Grid id='bottomWrapper'>
                        <Row>
                            <Col>
                                <div id='error'>
                                    <h6 className='error'> {this.props.storeQueryError} </h6>
                                    <h6 className='success'> {this.props.storeQueryMessage} </h6>
                                </div>
                            </Col>
                        </Row>
                        <div id='queryTabBottomWrapper'>
                            <Querybox />
                            <Interrogator id='interrogator' />
                        </div>
                    </Grid>
                </div>
            </div>
        )
    }
}

QueryTab.propTypes = {
    storeQueryCollectionState: PropTypes.object,
    storeQuery: PropTypes.object,
    storeQueryType: PropTypes.string,
    storeConfig: PropTypes.object,
    queryType: PropTypes.string,
    setConfigQueriesToStore: PropTypes.func,
    setQueryCollectionStateToStore: PropTypes.func,
    setQueryValuesToStore: PropTypes.func,
    // setCollectionToStore: PropTypes.func,
    _collectionStateTemplate: PropTypes.object,
    _stageTemplate: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryTab);
