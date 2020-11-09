const postReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_POSTS_LIST':
            return [
                ...state,
                ...action.postsList
            ]
        case 'RESET_POST_LIST':
            return []
        default:
            return state
    }
}

export default postReducer;