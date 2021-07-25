import React, { useState, useEffect } from "react";
import "./ModalCart.css";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "../../Utils/Cookie";
import { get } from "../../Utils/httpHelper";
import { TiShoppingCart } from "react-icons/ti";
import ModalDelte from "../Admin/ModalDeleteConfirm";
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  Col,
  Row,
  Label,
  Input,
} from "reactstrap";

toast.configure();
const ModalCart = (props) => {
  const history = useHistory();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [prodList, setProdList] = useState([]);
  const toggle = () => {
        let status = getCookie("status");
        if (status === "true")
      setPopoverOpen(!popoverOpen)
    };

  useEffect(() => {
    if (popoverOpen) {
      //   let cartCookie = getCookie("cart");
      //   if (cartCookie.trim().length !== 0) {
      //     // history.push(`/Ordering`);
      //     setProdList([]);
      //     getProdList();
      //   } else {
      //     toast.info("🦄 Cart is empty. Fill it in righ away", {
      //       position: toast.POSITION.TOP_RIGHT,
      //       autoClose: 3000,
      //     });
      //   }
      getProdList();
    }
  }, [popoverOpen]);

  useEffect(() => {
    // setCartCookie();
  }, [prodList]);

  async function setCartCookie(list){
    let strListProd = "";
    
    list.map((prod) => {
        strListProd = strListProd.concat(`${prod.id}-${prod.quantity} `);
      });
      console.log(`WILL UNMOUNT ${strListProd}`);
      document.cookie = `cart=${strListProd}; max-age=86400; path=/;`;
  }
  async function getProd(prod) {
    let prodDetail = prod.split("-");
    await get(`/public/product/search/${prodDetail[0]}`).then((response) => {
      if (response.status === 200) {
        // console.log(response.data);
        let prod = response.data;
        prod.quantity = prodDetail[1];
        setProdList((oldArr) => [...oldArr, prod]);
      }
    });
  }
  async function getProdList() {
    // const listprod = getCookie("cart").split(" ");
    // listprod.map((prod) => getProd(prod));

    let cartCookie = getCookie("cart");
    if (cartCookie.trim().length !== 0) {
      // history.push(`/Ordering`);
      setProdList([]);
      const listprod = getCookie("cart").split(" ");
      listprod.map((prod) => getProd(prod));
    } else {
      toast.info("🦄 Cart is empty. Fill it in righ away", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  }

  async function handleProdFieldChange(e, key, index) {
    let list = [...prodList];
    let prod = { ...list[index] };
    prod.quantity = e.target.value;
    list[index] = prod;
    
    await setProdList(list);
    setCartCookie(list);

  }
  async function handleDelete(e, index) {
    if (e === "OK") {
        let list = [...prodList];
        list.splice(index,1);
        await setProdList(list);
        setCartCookie(list);
    }
  }
  function handleOrder() {
    history.push(`/Ordering`);
  }
  return (
    <div>
      <Button id="Popover1" type="button" color="link">
        <TiShoppingCart size={40} />
      </Button>
      <Popover
        placement="left-end"
        isOpen={popoverOpen}
        target="Popover1"
        toggle={toggle}
        // className="popoverCart"
      >
        {/* <PopoverHeader className="popoverCart">Shopping Cart</PopoverHeader> */}
        <PopoverBody className="popoverCart">
          {prodList.map((prod, index) => (
            <div key={index}>
              <Row className="cart-form" key={prod.id}>
                <Col className="col-4">
                  <img
                    src={`data:image/jpeg;base64,${prod.photo}`}
                    className="img-cart"
                  />
                </Col>
                <Col className="infoCart">
                  <h6>{prod.name}</h6>
                  <Row>
                    <Col className="col-2">
                      <Label for="exampleQuantity">Qty</Label>
                    </Col>
                    <Row>
                      <Col className="col-5">
                        <Input
                          type="number"
                          name={`quantity${index}`}
                          id="exampleQuantity"
                          min="1"
                          required
                          value={prod.quantity}
                          className="quantityCart"
                          onChange={(e) =>
                            handleProdFieldChange(e, "quantity", index)
                          }
                        />
                      </Col>
                      <Col className="col-1"></Col>
                      <Col>
                        <ModalDelte
                          onChoice={(e) => handleDelete(e, index)}
                        />
                      </Col>
                    </Row>
                  </Row>
                </Col>
              </Row>
              <hr />
              
            </div>
          ))}
          <Button outline color="primary" onClick={() => handleOrder()}>Order</Button>
        </PopoverBody>
      </Popover>
    </div>
  );
};

export default ModalCart;
