import Register from "./components/Register";
<<<<<<< HEAD
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";
import ipConfig from "./ipConfig.json";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export const config = {
  endpoint: `https://qkart-frontendd-4cks.onrender.com/api/v1`,
  // endpoint:'https://qkartbackend-lojd.onrender.com/api/v1'
=======
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
>>>>>>> origin/master
};

function App() {
  return (
<<<<<<< HEAD
    <div className="App" id="root">
      <Router>
        <Switch>
          <Route exact path="/">
            <Products />
          </Route>
          <Route path="/checkout">
            <Checkout />
          </Route>
          <Route path="/thanks">
            <Thanks />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </Router>
=======
    <div className="App">
          <Register />
>>>>>>> origin/master
    </div>
  );
}

export default App;
