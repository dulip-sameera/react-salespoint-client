import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Provider from "./providers/Provider";
import Test from "./pages/Test";
import {
  UI_PATH_ADD_CUSTOMER,
  UI_PATH_ADD_ITEM,
  UI_PATH_ADD_USER,
  UI_PATH_CUSTOMER,
  UI_PATH_HOME,
  UI_PATH_ITEM,
  UI_PATH_ITEM_CATEGORY,
  UI_PATH_LOGIN,
  UI_PATH_UPDATE_CUSTOMER,
  UI_PATH_UPDATE_ITEM,
  UI_PATH_UPDATE_USER,
  UI_PATH_USER,
} from "./constants/paths";
import { CssBaseline } from "@mui/material";
import HomePage from "./pages/HomePage";
import CustomerPage from "./pages/CustomerPage";
import AddCustomerPage from "./pages/AddCustomerPage";
import UpdateCustomerPage from "./pages/UpdateCustomerPage";
import UserPage from "./pages/UserPage";
import AddUserPage from "./pages/AddUserPage";
import UpdateUserPage from "./pages/UpdateUserPage";
import ItemPage from "./pages/ItemPage";
import ItemCategoryPage from "./pages/ItemCategoryPage";
import AddItemPage from "./pages/AddItemPage";
import UpdateItemPage from "./pages/UpdateItemPage";

const App = () => {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          // both paths leads to login page
          {["/", UI_PATH_LOGIN].map((path, id) => (
            <Route key={id} path={path} element={<LoginPage />} />
          ))}
          <Route path={UI_PATH_HOME} element={<HomePage />} />
          <Route path={UI_PATH_CUSTOMER} element={<CustomerPage />} />
          <Route path={UI_PATH_ADD_CUSTOMER} element={<AddCustomerPage />} />
          <Route
            path={`${UI_PATH_UPDATE_CUSTOMER}/:id`}
            element={<UpdateCustomerPage />}
          />
          <Route path={UI_PATH_USER} element={<UserPage />} />
          <Route path={UI_PATH_ADD_USER} element={<AddUserPage />} />s
          <Route
            path={`${UI_PATH_UPDATE_USER}/:id`}
            element={<UpdateUserPage />}
          />
          <Route path={UI_PATH_ITEM} element={<ItemPage />} />
          <Route path={UI_PATH_ADD_ITEM} element={<AddItemPage />} />
          <Route
            path={`${UI_PATH_UPDATE_ITEM}/:id`}
            element={<UpdateItemPage />}
          />
          <Route path={UI_PATH_ITEM_CATEGORY} element={<ItemCategoryPage />} />
          <Route path="/test" element={<Test />} />
        </Routes>
        <ToastContainer theme="colored" />
        <CssBaseline />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
