
const mapStateToProps = (state) => { // use this also to select what propsApp should listen to to rerender
    // console.log('@@ APP -> mapStateToProps');
    return {
        queryLoader: state.graphic.loaders.queryLoader
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export { mapStateToProps, mapDispatchToProps};
