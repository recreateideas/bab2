import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../store/mapToProps/mapToProps_Background';
import RightSlideOut from './RightSlideOut';
import JSONPretty from 'react-json-pretty';
import PropTypes from 'prop-types';
import { isNotEmptyArray, formatUglyJSON } from '../../tools/helpers';


class Background extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fontSize: 14,
            displayMinified: 'hidden',
            displayPretty: 'show',
            baboonLogo: require('../../images/baboon_white_monkey.png')
        };
        this.toggleMinified = this.toggleMinified.bind(this);
        this.changeFontSize = this.changeFontSize.bind(this)
    }

    displayJSON(isJSONprettyOrUgly) {
        if (isJSONprettyOrUgly === 'pretty')
            this.setState({
                displayPretty: 'show',
                displayMinified: 'hidden'
            });
        else if (isJSONprettyOrUgly === 'ugly')
            this.setState({
                displayPretty: 'hidden',
                displayMinified: 'show'
            });
    }

    componentWillReceiveProps(nextProps) {
        const { storeisPretty } = nextProps;
        storeisPretty ? this.displayJSON('pretty') : this.displayJSON('ugly');
        this.scrollToBottom();
    }

    changeFontSize(action) {
        let { fontSize } = this.state;
        if (fontSize > 8 && fontSize < 40) {
            switch (action) {
                case 'increase': fontSize++; break;
                default: fontSize--; break;
            }
            this.setState({ fontSize });
        }
    }

    toggleMinified() {
        const { displayPretty } = this.state;
        displayPretty === 'show' ? this.displayJSON('ugly') : this.displayJSON('pretty');
        this.togglePrettyCursorToStore();
    }

    togglePrettyCursorToStore() {
        let { storeActiveCursors } = this.props;
        const {
            insertCursorInQueryToStore,
            storeisPretty,
            storeConfig: {
                cursors: {
                    pretty
                }
            },
        } = this.props;
        storeisPretty ? delete storeActiveCursors.pretty : storeActiveCursors.pretty = pretty;
        insertCursorInQueryToStore(storeActiveCursors);
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.jsonEnd.scrollIntoView({ behavior: "instant" });
    }

    render() {
        const { storeResults } = this.props;
        const { fontSize, displayPretty, displayMinified, baboonLogo } = this.state;
        const resultClass = isNotEmptyArray(storeResults) ? 'show' : 'hidden';
        return (
            <div>
                <JSONPretty ref={(el) => { this.json = el; }} id='mongo_results' space={2} style={{ fontSize: `${fontSize}px` }} json={storeResults} className={`${resultClass} ${displayPretty}`}></JSONPretty>
                <div id='minifiedContainer' className={displayMinified}><p style={{ fontSize: `${fontSize}px` }} dangerouslySetInnerHTML={{ __html: formatUglyJSON(storeResults) }} /></div>
                < div className='headerTitle'>
                    <img src={baboonLogo} alt='logo' className='baboonLogo' />
                </div>
                <RightSlideOut
                    increaseFont={() => this.changeFontSize('increase')}
                    decreaseFont={() => this.changeFontSize('decrease')}
                    fontSize={fontSize}
                    toggleMinified={this.toggleMinified}
                />
                <div className='jsonEnd' ref={(el) => { this.jsonEnd = el; }}></div>
            </div>
        )
    }
}

Background.propTypes = {
    storeResults: PropTypes.array,
    storeisPretty: PropTypes.bool,
    insertCursorInQueryToStore: PropTypes.func,
    storeConfig: PropTypes.object,
};


export default connect(mapStateToProps, mapDispatchToProps)(Background);
