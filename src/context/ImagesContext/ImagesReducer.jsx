const ImagesReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_IMAGES":
      return {
        ...state,
        images: action.payload,
      };
    case "GET_IMAGES":
      return {
        ...state,
        images: action.payload,
      };
    case "GET_IMAGE":
      return {
        ...state,
        image: action.payload[0],
        images: action.payload[1],
      };
    default:
      return state;
  }
};

export default ImagesReducer;
