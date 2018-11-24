import React from 'react';
import FormLine from './FormLine';
import { Grid, Row, Col } from 'react-bootstrap';
import { AddRemove, SelectInput, CheckBox, TextInput } from '../BasicComponents';
import { connect } from 'react-redux';
// import { _paramsLine } from '../../dataTemplates/collectionState'
import { mapStateToProps, mapDispatchToProps } from '../../store/mapToProps/mapToProps_Stage';
// import { mapStateToTemplatesProps } from '../../store/mapToProps/mapToProps_DataTemplates';

import PropTypes from 'prop-types';

const FontAwesome = require('react-fontawesome');

class Stage extends React.Component {

    addKeyValuePair() {
        // console.log('ADD');
        const stage = this.props.stage;
        let collection = this.props.storeQueryCollectionState;
        let params = collection[stage].params;
        const _template = JSON.parse(JSON.stringify(this.props._paramsLine));
        Object.keys(params)
            .map(key => params[key].push(_template[key][0]))
        this.props.setQueryCollectionStateToStore(collection);
    }

    removeKeyValuePair(e) {
        // console.log(e.target);
        const index = e.target.id.split('_')[0];
        const stage = e.target.id.split('_')[2] + '_' + e.target.id.split('_')[3];
        let collection = this.props.storeQueryCollectionState;
        let params = collection[stage].params;
        // console.log(params);
        if (params.keys.length > 1) {
            Object.keys(params)
                .forEach(key => params[key].splice(index, 1));//filter((item, idx) => idx != index))
            this.props.setQueryCollectionStateToStore(collection);
        }
    }

    activateStage(e) {
        let collection = this.props.storeQueryCollectionState;
        collection[this.props.stage].isActive = e.target.checked;
        this.props.setQueryCollectionStateToStore(collection);
    }

    recordPipeInQuery(e) {
        let collection = this.props.storeQueryCollectionState;
        collection[this.props.stage].preStage = e.target.value;
        this.props.setQueryCollectionStateToStore(collection);
    }

    renderFormLine(key, index) {
        // console.log('STAGE -> renderFormLine: ' + key + ' , ' + index);
        const stage = this.props.stage;
        const collection = this.props.storeQueryCollectionState[stage];
        // console.log(collection.params.actives[index]);
        return (
            <FormLine
                key={index}
                stage={stage}
                index={index}
                isStageActive={collection.isActive}
                clickAdd={this.addKeyValuePair.bind(this)}
                clickRemove={this.removeKeyValuePair.bind(this)}
                checked={collection.params.actives[index]}
                values={this.props.stageValues}
            />)
    }

    renderPipeComponent() {
        // console.log('STAGE -> renderPipeComponent()');
        const queryType = this.props.queryData;
        const stage = this.props.stage;
        const collection = this.props.storeQueryCollectionState[stage];
        // console.log(collection);
        const activePipe = collection.isActive === false ? 'inActive' : ''
        let label = (queryType.label ? queryType.label.replace('#', this.props.index) : '');
        switch (queryType.preParamsInput) {
            case 'text':
                return (
                    <Row className='pipelineStage roundBorder'>
                        <Col xs={6} className='titleContainer'><div className='fieldTitle'><p className='h7'>{label}</p></div></Col>
                        <Col xs={6} className='inputContainer'>
                            <TextInput
                                change={this.recordPipeInQuery.bind(this)} /*this.props.changePipe*/
                                inputRef={this.props.inputRef}
                                inputId={stage + '_' + queryType.preParamsInput}
                                label={'field'}
                                activeClass={activePipe}
                                inputWidth={250}
                            />
                        </Col>
                    </Row>
                );
            case 'select':
                return (
                    <Row className='pipelineStage roundBorder'>
                        <Col xs={6} className='titleContainer'><div className='fieldTitle'><p className='h7'>{label}</p></div></Col>
                        <Col xs={6} className='inputContainer'>
                            <SelectInput
                                inputId={stage + '_' + queryType.preParamsInput}
                                className={activePipe + ' inputSelect'}
                                change={this.recordPipeInQuery.bind(this)} /*this.props.changePipe*/
                                valueRange={this.props.preValues}
                                value={collection.preStage}
                            />
                        </Col>
                    </Row>
                );
            default:
                return;
        }
    }

    displayStageButtons(index) {
        let displayButtons = 'none';
        const queryType = this.props.storeQueryType; //sgtore updates in  the devtools but not in here
        // console.log('queryType', queryType);
        const extend = this.props.storeConfig.queries[queryType].extendable;
        const length = Object.keys(this.props.storeQuery.stages).length;
        // console.log(this.store);
        if (extend) {
            if (index === length - 1) {
                displayButtons = 'show_PMC'
            }
            if (index < length - 1) {
                displayButtons = 'show_MC'
            } else if (length === 1) {
                displayButtons = 'show_PC'
            }
        }
        return displayButtons;
    }

    removeStage() {
        // console.log('STAGE -> removeStage ');
        this.props.deleteStage(this.props.stage);
    }

    renderAddRemoveStage() {
        // console.log('STAGE -> renderAddRemoveStage: ' + this.props.index);
        return (
            <AddRemove
                inputIdAdd={this.props.index + '_addstage_' + this.props.stage}
                inputIdRemove={this.props.index + '_removestage_' + this.props.stage}
                activeCLass={this.stageClass}
                display={this.displayStageButtons(this.props.index - 1)}
                clickAdd={this.props.addStage}
                clickRemove={this.removeStage.bind(this)}
                classBtn={'addRemoveStageBtn'}
            />
        );
    }

    render() {
        // console.log('STAGE -> render');
        const stage = this.props.stage;
        const collection = this.props.storeQueryCollectionState[stage];
        // console.log(collection);
        return (
            <div id={`stageWrapper_${this.props.index}`} className='stageWrapper'>
                <div id={`stage_${this.props.index}`} className={'stage contentTable queryCollectionTable max-content ' + collection.display}>
                    <div className='stageBadgeWrapper'>
                        <div id={`stageTitle_${this.props.index}`} className={`stageTitle`}><h4>{`Stage ${this.props.index}`}</h4></div>
                        <FontAwesome name='puzzle-piece' size='4x' /*spin*/ className={`stageIcon`} flip='horizontal' />
                    </div>
                    <CheckBox
                        label={'isStageActive_' + this.props.index}
                        inputId={this.props.index + '_activesStages_' + this.props.stage}
                        change={this.activateStage.bind(this)}
                        checked={collection.isActive}
                        className={'stagecheck'}
                        spanClass={'large_checkmark'}
                    />
                    <Grid className='keysTable FormLineTable'>
                        {this.renderPipeComponent()}

                        <Row className='formLineHeader'>
                            <Col xs={5} className='1sfHalf'>
                                <Row className='webkit-box'>
                                    <Col className={'activeCol header'} xs={2}>
                                        <p className='h7'>Use</p>
                                    </Col>
                                    <Col xs={8} className='keyCol header'>
                                        <p className='h7'>Key</p>
                                    </Col>
                                    <Col xs={2} className={'operatorCol header'}>
                                        <p className='h7'>Operator</p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={7} className='2ndHalf'>
                                <Row className='webkit-box'>
                                    <Col xs={1} xsHidden={true} className={'vTypeSynLeftCol header'}>
                                    </Col>
                                    <Col xs={5} className='valueCol header'>
                                        <p className='h7'>Value</p>
                                    </Col>
                                    <Col xs={1} xsHidden={true} className={'vTypeSynRightCol header'}>
                                    </Col>
                                    <Col xs={2} md={3} className={'typeCol header'}>
                                        <p className='h7'>Type</p>
                                    </Col>
                                    <Col xs={3} md={2} className={'addLineCol header'}>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {collection.params.keys.map((key, index) => this.renderFormLine(key, index))}

                    </Grid>
                </div>
                {this.renderAddRemoveStage()}
            </div>
        );
    }
}

Stage.propTypes = {
    stage: PropTypes.string,
    storeQueryCollectionState: PropTypes.object,
    stageValues: PropTypes.object,
    inputRef: PropTypes.string,
    queryData: PropTypes.object,
    index: PropTypes.string,
    preValues: PropTypes.array,
    storeQueryType: PropTypes.string,
    storeConfig: PropTypes.object,
    addStage: PropTypes.func,
    setQueryCollectionStateToStore: PropTypes.func,
    deleteStage: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Stage);
