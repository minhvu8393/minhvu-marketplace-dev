export const setComponent = (component) => {
    return {
        type: 'SET_COMPONENT',
        component
    }
}

export const switchOpen = (openBoolean) => {
    return {
        type: 'SWITCH_OPEN',
        openBoolean
    }
}

export const setPostDetailId = (id) => {
    return {
        type: 'SET_POST_DETAIL_ID',
        id
    }
}