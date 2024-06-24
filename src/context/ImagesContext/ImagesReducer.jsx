const ImagesReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_IMAGES":
      return {
        ...state,
        images: action.payload,
        loading: false,
      };
    case "GET_IMAGES":
      return {
        ...state,
        images: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default ImagesReducer;
