import { createStore, applyMiddleware } from "redux";
import rootReducer from "./rootReducer"; // You'll create this file
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware()));

export default store;
