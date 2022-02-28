const incrementReducer = (state = { number: 0 }, action) => {
    switch(action.type) {
        case 'INCREMENT': {
            state.number += 1;
            return { ...state };
        }
        default: return state;
    }
};

const setDisplayMode = (state = { mode: undefined }, action) => {
    state.mode = action.mode;
    return { ...state };
};

export default (incrementReducer, setDisplayMode);