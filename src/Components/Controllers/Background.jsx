import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../store/mapToProps/mapToProps_Background';
import RightSlideOut from './RightSlideOut';
import JSONPretty from 'react-json-pretty';
import PropTypes from 'prop-types';


class Background extends React.Component {

    constructor() {
        super();
        this.state = {
            fontSize: 14,
            displayMinified: 'hidden',
            displayPretty: 'show',
        }
    }

    componentWillReceiveProps(nextProps) {
        !nextProps.storeisPretty ? this.setState({ displayPretty: 'hidden', displayMinified: 'show' }) : this.setState({ displayPretty: 'show', displayMinified: 'hidden' })

    }

    increaseFont() {
        let fontSize = this.state.fontSize;
        if (fontSize < 40) fontSize++;
        this.setState({ fontSize });
    }

    decreaseFont() {
        let fontSize = this.state.fontSize;
        if (fontSize > 8) fontSize--;
        this.setState({ fontSize });
    }

    toggleMinified() {
        this.state.displayPretty === 'show' ? this.setState({ displayPretty: 'hidden', displayMinified: 'show' }) : this.setState({ displayPretty: 'show', displayMinified: 'hidden' })
        this.togglePrettyCursorToStore();
    }

    togglePrettyCursorToStore() {
        let activeCursors = this.props.storeQuery.cursors;
        const prettyCursor = this.props.storeConfig.cursors.pretty;
        !this.props.storeisPretty ? activeCursors['pretty'] = prettyCursor : delete activeCursors.pretty;
        this.props.insertCursorInQueryToStore(activeCursors);
    }

    formatUglyJSON(json) {
        if (json && json !== []) {
            let html = JSON.stringify(json);
            html = html.replace(/("|{"|,")([^"]+)(":)/gm, `$1<span class='json-key'>$2</span>$3`);
            html = html.replace(/(:|\[)(")([^"]+)(")/gm, `$1<span class='json-string'>$2$3$4</span>`);
            html = html.replace(/(\[)(")([^"]+)(")(,|\]|,")/gm, `$1<span class='json-string'>$2$3$4</span>$5`);
            html = html.replace(/(,)(")([^"]+)(")(,|\])/gm, `$1<span class='json-string'>$2$3$4</span>$5`);
            html = html.replace(/(,|:\[|:{|:)(\d+)(,|\]|})/gm, `$1<span class='json-value'>$2</span>$3`);//
            html = html.replace(/(,|:\[|:{|:)(\d+)(])/gm, `$1<span class='json-value'>$2</span>$3`);
            return html;
        }
        else return '';
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.jsonEnd.scrollIntoView({ behavior: "instant" });
    }

    render() {
        let resultClass;
        if (this.props.storeResults) {
            resultClass = Object.keys(this.props.storeResults).length === 0 ? 'hidden' : 'show';
        }
        else resultClass = 'hidden';
        // console.log(window.location.pathname);
        return (
            <div>
                <JSONPretty ref={(el) => { this.json = el; }} id='mongo_results' space={2} style={{ fontSize: `${this.state.fontSize}px` }} json={this.props.storeResults} className={`${resultClass} ${this.state.displayPretty}`}></JSONPretty>
                <div id='minifiedContainer' className={this.state.displayMinified}><p style={{ fontSize: `${this.state.fontSize}px` }} dangerouslySetInnerHTML={{ __html: this.formatUglyJSON(this.props.storeResults) }} /></div>
                < div className='headerTitle'>
                    <img src={require('../../images/baboon_white_monkey.png')} alt='logo' className='baboonLogo' />
                    {/* <img src={require('../../images/slideright_label.png')} alt='logo' className='baboonLogo' />v */}
                </div>
                <RightSlideOut
                    increaseFont={this.increaseFont.bind(this)}
                    decreaseFont={this.decreaseFont.bind(this)}
                    fontSize={this.state.fontSize}
                    toggleMinified={this.toggleMinified.bind(this)}
                />
                <div style={{ float: "left", clear: "both" }} ref={(el) => { this.jsonEnd = el; }}></div>
            </div>
        )
    }
}

Background.propTypes = {
    storeResults: PropTypes.array
};


export default connect(mapStateToProps, mapDispatchToProps)(Background);
