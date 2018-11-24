const mapStateToProps = (state) => {
    return {
        mongo_query: state.mongo.mongo_query
    }
}

export { mapStateToProps };
