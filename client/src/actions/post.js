export const setPostsList = (postsList) => {
    return {
        type: 'SET_POSTS_LIST',
        postsList
    }
}

export const resetPostList = () => {
    return {
        type: 'RESET_POST_LIST'
    }
}