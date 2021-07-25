import "./App.css";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Order from "./components/Order";
import ProductByType from "./components/ProductByType";
import ProductDetail from "./components/ProductDetail";
import Home1 from "./components/Home1/Home1";
import { BrowserRouter, Route } from "react-router-dom";
import React from "react";
import PrivateRouteAdmin from "./components/PrivateRouteAdmin";
import PrivateRouteUser from "./components/PrivateRouteUser";

function App() {
  // const [loginStatus, setLoginStatus] = useState(getCookie("status"));

  // useEffect(() => {
  //   console.log(`STATUS CHANE: ${loginStatus}`);
  // }, [loginStatus]);
  // useEffect(() => {}, []);

  // function handleStatusChange(e) {
  //   setLoginStatus(true);
  // }
  // function handleLogOut(e) {
  //   setLoginStatus(false);
  // }

  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/">
          <Header />
          <Navbar/>
          <Home1 />
          <Footer />
        </Route>
        <Route exact path="/Bike/:id">
          <Header />
          <Navbar />
          <ProductByType />
          <Footer />
        </Route>
        <Route exact path="/prodDetail/:id">
          <Header />
          
          <ProductDetail />
          <Footer />
        </Route>
        <Route exact path="/Login">
          <Header />
          
          <Login />
          <Footer />
        </Route>
        <PrivateRouteAdmin exact path="/Admin" component={Admin} />
        <PrivateRouteUser exact path="/Ordering" component={Order} />
      </div>
    </BrowserRouter>
  );
}

export default App;
