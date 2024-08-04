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
        // image: action.payload[0],
        images: action.payload,
        loading: false,
      };
    case "GET_IMAGE":
      return {
        ...state,
        image: action.payload[0],
        images: action.payload[1],
        loading: false,
      };
    default:
      return state;
  }
};

export default ImagesReducer;
