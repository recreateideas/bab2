import React from 'react';
import PropTypes from 'prop-types';

class AddRemove extends React.Component {

    displayObjects() {
        const { display } = this.props;
        switch (display) {
            case 'show_P':
                this.displayComma = 'noVisibility'; this.displayPlus = 'show'; this.displayMinus = 'hidden';
                break;
            case 'show_M':
                this.displayComma = 'show'; this.displayPlus = 'hidden'; this.displayMinus = 'show';
                break;
            case 'show_PM':
                this.displayComma = 'noVisibility'; this.displayPlus = 'show'; this.displayMinus = 'show';
                break;
            case 'show_PC':
                this.displayComma = 'noVisibility'; this.displayPlus = 'show'; this.displayMinus = 'hidden';
                break;
            case 'show_MC':
                this.displayComma = 'noVisibility'; this.displayPlus = 'hidden'; this.displayMinus = 'show';
                break;
            case 'show_PMC':
                this.displayComma = 'noVisibility'; this.displayPlus = 'show'; this.displayMinus = 'show';
                break;
            case 'none':
                this.displayComma = 'noVisibility'; this.displayPlus = 'hidden'; this.displayMinus = 'hidden';
                break;
            default:
                this.displayComma = 'noVisibility'; this.displayPlus = 'show'; this.displayMinus = 'hidden';
                break;
        }
        return;
    }

    render() {
        this.displayObjects();
        const { inputIdAdd, activeCLass, classBtn, clickAdd, inputIdRemove, clickRemove } = this.props;
        return (
            <div className='addRemove'>
                <div className={'comma inline ' + this.displayComma}><b>&#65292;</b></div>
                <button id={inputIdAdd} className={activeCLass + ' ' + classBtn + ' ' + this.displayPlus} onClick={clickAdd}>&#43;</button>
                <button id={inputIdRemove} className={activeCLass + ' ' + classBtn + ' ' + this.displayMinus} onClick={clickRemove}>&#8722;</button>
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
