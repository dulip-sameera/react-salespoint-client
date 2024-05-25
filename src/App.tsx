import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Provider from "./providers/Provider";
import Test from "./pages/Test";
import { UI_PATH_HOME, UI_PATH_LOGIN } from "./constants/paths";
import { CssBaseline } from "@mui/material";
import HomePage from "./pages/HomePage";

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
          <Route path="/test" element={<Test />} />
        </Routes>
        <ToastContainer />
        <CssBaseline />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
