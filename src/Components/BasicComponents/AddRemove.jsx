import React from 'react';
import PropTypes from 'prop-types';

class AddRemove extends React.Component {
    // constructor() {
    //     super();
    //     let displayComma = 'hidden';
    //     let displayMinus = 'hidden';
    //     let displayPlus = 'show';
    // }
    
    displayObjects() {
        const display = this.props.display;
        // console.log('+/-');
        switch (display) {
            case 'show_P':
                this.displayComma= 'noVisibility'; this.displayPlus= 'show'; this.displayMinus= 'hidden';
                break;
            case 'show_M':
                this.displayComma= 'show'; this.displayPlus= 'hidden'; this.displayMinus= 'show';
                break;
            case 'show_PM':
                this.displayComma= 'noVisibility'; this.displayPlus= 'show'; this.displayMinus= 'show';
                break;
            case 'show_PC':
                this.displayComma= 'noVisibility'; this.displayPlus= 'show'; this.displayMinus= 'hidden';
                break;
            case 'show_MC':
                this.displayComma= 'noVisibility'; this.displayPlus= 'hidden'; this.displayMinus= 'show';
                break;
            case 'show_PMC':
                this.displayComma= 'noVisibility'; this.displayPlus= 'show'; this.displayMinus= 'show';
                break;
            case 'none':
                this.displayComma= 'noVisibility'; this.displayPlus= 'hidden'; this.displayMinus= 'hidden';
                break;
            default:
                this.displayComma= 'noVisibility'; this.displayPlus= 'show'; this.displayMinus= 'hidden';
                break;
        }
        return;
    }
    
    render() {
        this.displayObjects();
        return (
            <div className='addRemove'>
                <div className={'comma inline ' + this.displayComma}><b>&#65292;</b></div>
                <button id={this.props.inputIdAdd} className={this.props.activeCLass + ' ' + this.props.classBtn + ' ' + this.displayPlus} onClick={this.props.clickAdd}>&#43;</button>
                <button id={this.props.inputIdRemove} className={this.props.activeCLass + ' ' + this.props.classBtn + ' ' + this.displayMinus} onClick={this.props.clickRemove}>&#8722;</button>
            </div>
        )
    }
}

AddRemove.propTypes = {
    inputIdAdd: PropTypes.string,
    inputIdRemove: PropTypes.string,
    display: PropTypes.string,
    activeCLass: PropTypes.string,
    classBtn: PropTypes.string,
    clickAdd: PropTypes.func,
    clickRemove: PropTypes.func,
};


export default AddRemove;
