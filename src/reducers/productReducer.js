import {
  SET_PRODUCT,
  SET_REPLACE_PRODUCT,
  SET_PRODUCTS,
  GET_CATEGORIES,
  SEARCH_PRODUCTS,
  SET_PRODUCT_DETAIL,
  SET_SELECTED_CATEGORY_ID,
  SET_SELECTED_PRODUCT_TAB,
  ROUGHT_IN_TRIM_OUT,
  IS_FAVORITE,
  GET_BRANDS,
  SET_PRODUCT_LOADING,
  SET_REPLACE_PRODUCT_ROOMS,
  SET_REPLACE_OLD_PRODUCT,
  SET_REPLACE_OLD_PRODUCT_DETAILS,
} from "../actions/types";

const intialState = {
  replaceOldProduct: {},
  products: [],
  productDetail: {},
  replaceOldProductDetails: {},
  replaceProductRooms: [],
  productCategories: [],
  selectedCategoryID: "",
  selectedProductTab: "products",
  roughInTrimOut: {},
  isFavorite: false,
};

const productReducer = (state = intialState, action) => {
  switch (action.type) {
    case SET_PRODUCT_LOADING:
      return { ...state, productsLoading: action.payload };
    case GET_BRANDS: {
      return {
        ...state,
        brands: action.payload,
      };
    }
    case GET_CATEGORIES: {
      return {
        ...state,
        productCategories: (action.payload || [])?.sort((a, b) =>
          a.Name?.localeCompare(b.Name)
        ),
      };
    }
    case SEARCH_PRODUCTS: {
      return {
        ...state,
        products: action.payload,
      };
    }
    case SET_SELECTED_CATEGORY_ID: {
      return {
        ...state,
        selectedCategoryID: action.payload,
      };
    }
    case SET_PRODUCT: {
      return {
        ...state,
        product: action.payload,
      };
    }

    case SET_REPLACE_OLD_PRODUCT: {
      return {
        ...state,
        replaceOldProduct: action.payload,
      };
    }

    case SET_REPLACE_OLD_PRODUCT_DETAILS: {
      return {
        ...state,
        replaceOldProductDetails: action.payload,
      };
    }

    case SET_REPLACE_PRODUCT: {
      return {
        ...state,
        replaceProduct: action.payload,
      };
    }
    case SET_REPLACE_PRODUCT_ROOMS: {
      return {
        ...state,
        replaceProductRooms: action.payload,
      };
    }
    case SET_PRODUCTS: {
      return {
        ...state,
        products: action.payload,
      };
    }
    case SET_PRODUCT_DETAIL: {
      return {
        ...state,
        productDetail: action.payload,
      };
    }
    case SET_SELECTED_PRODUCT_TAB: {
      return {
        ...state,
        selectedProductTab: action.payload,
      };
    }
    case ROUGHT_IN_TRIM_OUT: {
      return {
        ...state,
        roughInTrimOut: action.payload,
      };
    }
    case IS_FAVORITE: {
      return {
        ...state,
        isFavorite: action.payload,
      };
    }
    default:
      return state;
  }
};

export default productReducer;
