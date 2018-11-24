import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'moment-timezone';
import {  Row, Col } from 'react-bootstrap';
import { AddRemove, SelectInput, CheckBox, TextInput, DateTimePickerButton } from '../index';
import { getElementsFromConfig } from '../../configuration/configHelpers/queryHelpers';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { mapStateToProps, mapDispatchToProps } from '../../store/mapToProps/mapToProps_FormLine';

class FormLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // date: moment.tz(new Date(), "")/*.utcOffset(moment().utcOffset())*/,
            date: '',
            // gmt: moment().utcOffset()/60,
            gmtString: (moment().utcOffset() / 60) > 0 ? `+${moment().utcOffset() / 60}:00` : `${moment().utcOffset() / 60}:00`,
            displayTooltip: 'hidden'
        }
    }
  

    componentWillReceiveProps(nextProps) {
        this.lineClass = (nextProps.checked === false ? 'inActive' : '');
        this.lineDisabled = (nextProps.checked === false ? true : false);

    }

    fetchLineState(index) {
        const stage = this.props.stage;
        const params = this.props.storeQueryCollectionState[stage].params;
        let items = [];
        Object.keys(params)
            .forEach(key => {
                let item = params[key][index];
                items.push(item);
            });
        return items;
    }

    displayLineButtons(index) {
        const stage = this.props.stage;
        const length = this.props.storeQueryCollectionState[stage].params.keys.length
        let displayLineButtons;
        if (index === length - 1) {
            displayLineButtons = 'show_PM'
        }
        if (index < length - 1) {
            displayLineButtons = 'show_M'
        }
        else if (length === 1) {
            displayLineButtons = 'show_P'
        }
        return displayLineButtons;
    }

    recordInQuery(e) { //doesnt record stage checkbox in state
        this.setState({ displayTooltip: 'hidden' })
        const element = e.target;
        const index = element.id.split('_')[0];
        const field = element.id.split('_')[1];
        const stage = element.id.split('_')[2] + '_' + element.id.split('_')[3];
        if (this.hasMongoDate() && field==='values' ) {
            const date = this.dateFromObjectId(element.value);
            if (date instanceof Object) {
                this.setDate(date);
                return;
            } else {
                this.setState({
                    date: 'Warning: this is not a date format.'
                });
            }
        } 
        let collection = this.props.storeQueryCollectionState;
        let params = collection[stage].params;
        let newStateArray = params[field].slice();
        newStateArray[index] = ((element.type === 'text' || element.type === 'select-one') ? element.value : element.checked);
        params[field] = newStateArray;
        this.props.setQueryCollectionStateToStore(collection);
        
    }

    dateFromObjectId(objectId) {
        let date = new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
        if (date instanceof Date && objectId.length === 24) {
            if (isNaN(date.getTime())) {  // date.valueOf() could also work
                return objectId;
            } else {
                return moment(date);
            }
        } else {
            return objectId;
        }
    };

    objectIdFromDate(date) {
        return Math.floor(date / 1000).toString(16) + "0000000000000000";
    };
    
    setDate(date) {
        console.log(this);
        const mongoId = this.objectIdFromDate(date);
        let collection = this.props.storeQueryCollectionState;
        const stage = this.props.stage;
        let params = collection[stage].params;
        let newStateArray = params['values'].slice();
        let index = this.props.index;
        newStateArray[index] = `${mongoId}`;
        console.log(newStateArray[index]);
        params['values'] = newStateArray;
        this.props.setQueryCollectionStateToStore(collection);
        this.setState({ date: date })
    }

    hasMongoDate(){
        const lineState = this.fetchLineState(this.props.index);
        const stringTypes = this.props.storeConfig.stringTypes;
        const vTypeSynLeft = lineState[3] ? stringTypes[lineState[3]].left : '"';
        return /ObjectId/.test(vTypeSynLeft) ? true : false;
    }

    displayTooltip() {
        console.log(this.state.date);
        if (this.hasMongoDate()) this.setState({ displayTooltip: 'show'})
        else this.setState({ displayTooltip: 'hidden'})
    }

    hideTooltip() {
        this.setState({ displayTooltip: 'hidden' })
    }

    GMTChange(e){
        const offset = e.target.value.replace(':','');
        let newDate = moment.utc(this.state.date);
        newDate = newDate.utcOffset(offset);
        const hourOffset = String(newDate._offset / 60);
        let offsetString = hourOffset.length === 1 && !/-/.test(hourOffset)? `0${hourOffset}` : hourOffset;
        offsetString = /-/.test(hourOffset) && hourOffset.length === 2 ? offsetString.replace('-', '-0') : offsetString;
        this.setDate(newDate._d);
        this.setState({
            date: newDate,
            gmtString: offset > 0 ? `+${offsetString}:00` : `${offsetString}:00`
        });
    }

    buildId(section){
        const idString = `${this.props.index}_${section}_${this.props.stage}`;
        return idString;
    }
    // buildId = this.buildId;
    
    render() {
        const lineState = this.fetchLineState(this.props.index)
        const stringTypes = this.props.storeConfig.stringTypes;
        const vTypeSynLeft = lineState[3] ? stringTypes[lineState[3]].left : '"';
        // console.log(this.props);
        if (!this.props.isStageActive) {
            this.lineClass = 'inActive';
            this.lineDisabled = true;
        }
        else if (lineState[0] !== undefined && lineState[0] === false) {
            this.lineClass = 'inActive';
            this.lineDisabled = true
        } else if (lineState[0] !== undefined && lineState[0] === true) {
            this.lineClass = '';
            this.lineDisabled = false
        }

        const vTypeSynRight = lineState[3] ? stringTypes[lineState[3]].right : '"';
        const displayPicker = /ObjectId/.test(vTypeSynLeft) ? 'flexBox' : 'hidden';

        const tooltipDate = typeof this.state.date !== 'string' ? `${this.state.date.format('LLLL')} GMT:${this.state.gmtString}` : 'Warning: this is not a date format.';
     
        let evenOdd = this.props.index % 2 === 0 ? 'oddRow' : 'evenRow';
        return (
            <Row id={`${this.props.index}_formLineRow_${this.props.stage}`} className={`roundBorder formLineRow ${evenOdd}`} >
                <Col xs={12} className='formLineRow_col'>
                    <Row className='webkit-box'>
                        <Col className={'activeCol '} xs={2}>
                            <CheckBox
                                inputId={this.buildId('actives')}
                                change={this.recordInQuery.bind(this)}
                                checked={lineState[0]}
                                defaultChecked={lineState[0]}
                                value={lineState[0]}
                                className={'querycheck'}
                            />
                        </Col>
                        <Col xs={8} className='inputBorder keyCol'>
                            <TextInput
                                inputId={this.buildId('keys')}
                                label={"Key"}
                                activeClass={this.lineClass}
                                disabled={this.lineDisabled}
                                change={this.recordInQuery.bind(this)}
                                value={lineState[1]} />
                        </Col>
                        <Col className={'operatorCol'} xs={2}>
                            <SelectInput
                                inputId={this.buildId('operators')}
                                className={this.lineClass + ' inputSelect'}
                                change={this.recordInQuery.bind(this)}
                                valueRange={getElementsFromConfig(this.props.storeConfig, 'operators')}
                                disabled={this.lineDisabled}
                                value={lineState[2]}
                            />
                        </Col>
                        <Col className={'vTypeSynLeftCol'} xs={1} xsHidden={true}>
                            <div id={this.props.index + '_vTypeSynLeft_' + this.props.stage}><p className='vTypeSynLeftColInner h7'>{vTypeSynLeft}</p></div>
                        </Col>
                        <Col xs={5} className='inputBorder valueCol'>
                            <div style={{display: 'flex'}}>
                                <TextInput
                                    inputId={this.buildId('values')}
                                    label={"Value"}
                                    activeClass={this.lineClass}
                                    change={this.recordInQuery.bind(this)}
                                    value={lineState[4]}
                                    disabled={this.lineDisabled}
                                    onHover={this.displayTooltip.bind(this)}
                                    onOut={this.hideTooltip.bind(this)}
                                />
                                <div className={`${displayPicker} spacePicker`}>
                                    <DatePicker
                                        id={this.buildId('mongoDate')}
                                        customInput={<DateTimePickerButton />}
                                        selected={typeof this.state.date !== 'string' ? this.state.date : null}
                                        onChange={this.setDate.bind(this)}
                                        showTimeSelect
                                        timeFormat="H:mm"
                                        timeIntervals={10}
                                        onGMTChange={this.GMTChange.bind(this)}
                                        valueGMT={this.state.gmtString}
                                        localTimeZone={true} //my prop
                                        dateFormat="DD MMM YYYY - HH:mm"
                                        timeCaption="time"
                                        openToDate={typeof this.state.date !== 'string' && this.state.date !== undefined && this.state.date !== '' ? this.state.date : moment()}
                                        placeholderText="Select a day"
                                        popperPlacement="bottom-start"
                                        shouldCloseOnSelect={false}
                                        popperModifiers={{
                                            offset: {
                                                enabled: true,
                                                offset: '-40px'
                                            },
                                            preventOverflow: {
                                                enabled: true,
                                                escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                                                boundariesElement: 'viewport'
                                            }
                                        }}
                                    />
                                </div>
                                <div id='mongoTooltip' className={this.state.displayTooltip}>
                                    {tooltipDate}
                                </div>
                            </div>
                        </Col>
                        <Col className={'vTypeSynRightCol'} xs={1} xsHidden={true}>
                            <div id={this.props.index + '_vTypeSynRight' + this.props.stage}><p className='h7'>{vTypeSynRight}</p></div>
                        </Col>
                        <Col className={'typeCol'} xs={3} md={3}>
                            <SelectInput
                                inputId={this.buildId('types')}
                                className={this.lineClass + ' inputSelect'}
                                change={this.recordInQuery.bind(this)}
                                valueRange={getElementsFromConfig(this.props.storeConfig, 'stringTypes')}
                                disabled={this.lineDisabled}
                                value={lineState[3]}
                            />
                        </Col>
                        <Col className={'addLineCol'} xs={2} md={2}>
                            <AddRemove
                                inputId={this.buildId('addline')}
                                inputIdRemove={this.props.index + '_removeline_' + this.props.stage}
                                activeClass={this.lineClass}
                                display={this.displayLineButtons(this.props.index)}
                                clickAdd={this.props.clickAdd}
                                clickRemove={this.props.clickRemove}
                                classBtn={'addRemoveLineBtn'}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

FormLine.propTypes = {
    checked: PropTypes.bool,
    stage: PropTypes.string,
    index: PropTypes.number,
    storeConfig: PropTypes.object,
    isStageActive: PropTypes.bool,
    storeQueryCollectionState: PropTypes.object,
    clickAdd: PropTypes.func,
    clickRemove: PropTypes.func,
    setQueryCollectionStateToStore: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormLine);
