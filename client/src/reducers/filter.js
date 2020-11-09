let initialFilterState = {
    category: undefined,
    startPrice: undefined,
    endPrice: undefined,
    startDate: undefined,
    endDate: undefined,
    search: undefined,
    recent: undefined
}

const filterReducer = (state = initialFilterState, action) => {
    switch (action.type) {
        case 'FILTER_BY_CATEGORY':
            return {
                ...state,
                category: action.category
            }
        case 'FILTER_BY_START_PRICE':
            return {
                ...state,
                startPrice: action.price
            }
        case 'FILTER_BY_END_PRICE':
            return {
                ...state,
                endPrice: action.price
            }
        case 'FILTER_BY_SEARCH':
            return {
                ...state,
                search: action.search
            }
        case 'FILTER_BY_RECENT':
            return {
                ...state,
                recent: action.recent
            }
        case 'RESET_ALL_FILTERS':
            return {
                ...initialFilterState
            }
        default: 
            return state;
    }
}

export default filterReducer;