
const mapStateToProps = (state) => { // use this also to select what propsApp should listen to to rerender
    // console.log('@@ APP -> mapStateToProps');
    return {
        collections: state.mongo.DBcollections,
        collectionStore: state.query.collection
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export { mapStateToProps, mapDispatchToProps};
