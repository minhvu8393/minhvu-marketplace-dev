export const filterByStartPrice = (price) => {
    return {
        type: 'FILTER_BY_START_PRICE',
        price
    }
}

export const filterByEndPrice = (price) => {
    return {
        type: 'FILTER_BY_END_PRICE',
        price
    }
}

export const filterByCategory = (category) => {
    return {
        type: 'FILTER_BY_CATEGORY',
        category
    }
}

export const filterBySearch = (search) => {
    return {
        type: 'FILTER_BY_SEARCH',
        search
    }
}

export const filterByRecent = (recent) => {
    return {
        type: 'FILTER_BY_RECENT',
        recent
    }
}

export const resetAllFilters = () => {
    return {
        type: 'RESET_ALL_FILTERS'
    }
}