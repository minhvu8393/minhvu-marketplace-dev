const initialModalState = {
    open: false,
    component: undefined,
    postDetailId: undefined,
}

const modalReducer = (state = initialModalState, action) => {
    switch (action.type) {
        case 'SWITCH_OPEN':
            return {
                ...state,
                open: action.openBoolean
            }
        case 'SET_COMPONENT':
            return {
                ...state,
                component: action.component
            }
        case 'SET_POST_DETAIL_ID':
            return {
                ...state,
                postDetailId: action.id
            }
        default:
            return state;
    }
}

export default modalReducer;