
const mapStateToTemplatesProps = (state) => { // use this also to select what propsApp should listen to to rerender
    // console.log('@@ APP -> mapStateToProps');
    return {
        _paramsLine : {
            actives: [true],
            keys: [''],
            operators: [Object.keys(state.config.operators)[0]],
            types: [Object.keys(state.config.stringTypes)[0]],
            values: ['']
        },
        _collectionStateTemplate: {
            isActive : true,
            preStage : '',
            params: {
                actives: [true],
                keys: [''],
                operators: [Object.keys(state.config.operators)[0]],
                types: [Object.keys(state.config.stringTypes)[0]],
                values: ['']
            }
        },
        _stageTemplate: {
            valueTypeLeft : '"',
            valueTypeRight :'"',
            isActive: true,
            preStage: '',
            params: {
                actives: [true],
                keys: [''],
                operators: [Object.keys(state.config.operators)[0]],
                types: [Object.keys(state.config.stringTypes)[0]],
                values: ['']
            }
        },
        _stage: {
            preParams: '',
            params: '',
            postParams: ''
        },
        _emptyUser: {
            loggedIn: false,
            ID:'',
            loginEmail:'',
            loginPassword:'',
            nickName: '',
            registerEmail:'',
            passWord:'',
            confirmPassWord:'',
        }
    }
}


export { mapStateToTemplatesProps };
