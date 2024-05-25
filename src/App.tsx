import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Provider from "./providers/Provider";
import Test from "./pages/Test";
import {
  UI_PATH_ADD_CUSTOMER,
  UI_PATH_CUSTOMER,
  UI_PATH_HOME,
  UI_PATH_LOGIN,
  UI_PATH_UPDATE_CUSTOMER,
} from "./constants/paths";
import { CssBaseline } from "@mui/material";
import HomePage from "./pages/HomePage";
import CustomerPage from "./pages/CustomerPage";
import AddCustomerPage from "./pages/AddCustomerPage";
import UpdateCustomerPage from "./pages/UpdateCustomerPage";

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
          <Route path="/test" element={<Test />} />
        </Routes>
        <ToastContainer theme="colored" />
        <CssBaseline />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
