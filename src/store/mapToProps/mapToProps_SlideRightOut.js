const mapStateToProps = (state) => {
    return {
        storeQueryResults: state.mongo.mongo_results,
        storeConnection: state.connection,
        storeUser: state.user,
        storeAllState: state,
    }
}

export { mapStateToProps };
