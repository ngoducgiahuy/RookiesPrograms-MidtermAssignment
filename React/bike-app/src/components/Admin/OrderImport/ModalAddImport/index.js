import React, { useState, useEffect } from "react";
import { get, post } from "../../../../Utils/httpHelper";
import { getCookie } from "../../../../Utils/Cookie";
import { numberFormat } from "../../../../Utils/ConvertToCurrency";
import "./ModalAddImport.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoAddOutline } from "react-icons/io5";
import { GrBike } from "react-icons/gr";
import { AiOutlineAppstore, AiOutlineClose } from "react-icons/ai";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Row,
  Col,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

toast.configure();
const ModalExample = (props) => {
  const [cateList, setCateList] = useState([]);
  const [prodList, setProdList] = useState([]);
  const [prodPickedList, setProdPickedList] = useState([]);
  const [modal, setModal] = useState(false);
  const [base64, setBase64] = useState("");
  const [choice, setChoice] = useState("1");
  const [dropdownOpen, setOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const toggle = () => setModal(!modal);
  const toggleDropdown = () => setOpen(!dropdownOpen);

  useEffect(() => {
    if (modal) {
      setProdPickedList([]);
      setTotal(0);
      get("/public/categories").then((response) => {
        if (response.status === 200) {
          setCateList([...response.data]);
        }
      });
      getProductList();
    }
  }, [modal]);

  useEffect(() => {
    getProductList();
  }, [choice]);

  useEffect(() => {
    getTotalPrice(prodPickedList);
  }, [prodPickedList]);

  async function getProductList() {
    setProdList([]);
    get(`/public/product/${choice}`).then((response) => {
      if (response.status === 200) {
        setProdList([...response.data]);
      }
    });
  }
  async function handleProdFieldChange(e, key, index) {
    let list = [...prodPickedList];
    let prod = { ...list[index] };
    if (key === "quantity") prod.quantity = e.target.value;
    else if (key === "price") prod.price = e.target.value;
    list[index] = prod;
    setProdPickedList(list);
  }
  function toArr() {
    let arr = [];
    prodPickedList.forEach((prod) => {
      let item = { productId: prod.id, amount: prod.quantity, unitprice: prod.price};
      arr = [...arr, item];
    });
    return arr;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const emailUser = getCookie("email");
    const body = JSON.stringify({
      employeeEmail: emailUser,
      totalCost: total,
      status : e.target.status.value,
      orderImportDetails : toArr(),
    });
    post("/imports", body)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Add successfully!!!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
          toggle();
        }
      })
      .catch((error) => {
        toast.error("Add failed, please check again", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
        console.log(error);
      });
  }

  async function getTotalPrice(list) {
    let totalCost = 0;
    list.map((prod) => {
      totalCost += prod.price * prod.quantity;
    });
    setTotal(totalCost);
  }
  async function handleProdPick(id) {
    let check = prodPickedList.some((prod) => prod.id === id);
    if (!check)
      prodList
        .filter((prod) => prod.id === id)
        .map((filtered) => {
          filtered.quantity = 1;
          filtered.price = 1000000;
          setProdPickedList((oldArr) => [...oldArr, filtered]);
        });
  }
  async function handleProdPickRemove(index) {
    let list = [...prodPickedList];
    list.splice(index, 1);
    setProdPickedList(list);
  }

  return (
    <div>
      <div className="btn-modal">
        <Button color="info" onClick={toggle} className="btn-modal">
          <IoAddOutline /> Add new Import Order
        </Button>
      </div>
      <Modal isOpen={modal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>
          <GrBike /> Import Order Information
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <ButtonDropdown
              isOpen={dropdownOpen}
              toggle={toggleDropdown}
              className="mb-3"
            >
              <DropdownToggle caret>
                <AiOutlineAppstore />
                {cateList
                  .filter((cate) => cate.id === choice)
                  .map((filtered) => (
                    <>{filtered.name}</>
                  ))}
              </DropdownToggle>
              <DropdownMenu>
                {cateList.map((cate) => (
                  <div key={cate.id}>
                    <DropdownItem onClick={() => setChoice(cate.id)}>
                      {cate.name}
                    </DropdownItem>
                    <DropdownItem divider />
                  </div>
                ))}
              </DropdownMenu>
            </ButtonDropdown>{" "}
            <div class="scrollable">
              {prodList.map((prod, index) => (
                <Row className="mb-3">
                  <Col className="col-9">
                    <Label>
                      <img
                        src={`data:image/jpeg;base64,${prod.photo}`}
                        className="img-cart"
                      />
                      {prod.name}
                    </Label>
                  </Col>
                  <Col className="btn-addProd">
                    <Button
                      outline
                      color="info"
                      onClick={() => handleProdPick(prod.id)}
                    >
                      {" "}
                      <IoAddOutline /> Add
                    </Button>
                  </Col>
                </Row>
              ))}
            </div>
            <Table bordered>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>PRODUCT NAME</th>
                  <th>QUANTITY</th>
                  <th>UNIT PRICE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {prodPickedList.map((prod, index) => (
                  <tr key={prod.id}>
                    <td>{prod.id}</td>
                    <td className="prodName-title">{prod.name}</td>
                    <td>
                      <FormGroup>
                        <Input
                          type="number"
                          name="quantity"
                          id="examplePrice"
                          required="required"
                          min="1"
                          value={prod.quantity}
                          onChange={(e) =>
                            handleProdFieldChange(e, "quantity", index)
                          }
                        />
                      </FormGroup>
                    </td>
                    <td>
                      <FormGroup>
                        <Input
                          type="number"
                          name="price"
                          id="examplePrice"
                          required="required"
                          min="500000"
                          step="1000"
                          value={prod.price}
                          onChange={(e) =>
                            handleProdFieldChange(e, "price", index)
                          }
                        />
                      </FormGroup>
                    </td>
                    <td>
                      <Button
                        color="danger"
                        className="btn-removeProd"
                        onClick={() => handleProdPickRemove(index)}
                      >
                        <AiOutlineClose />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <FormGroup tag="fieldset" className="radioGr-user">
              <Label for="exampleQuantity">Status</Label>
              <FormGroup check className="radioBtn-user">
                <Label check>
                  <Input type="radio" name="status" value="false" required />{" "}
                  Waiting for delivery
                </Label>
              </FormGroup>
              <FormGroup check className="radioBtn-user">
                <Label check>
                  <Input type="radio" name="status" value="true" /> Deliverd
                </Label>
              </FormGroup>
            </FormGroup>
            <Row>
              <Col className="priceTotal">
                <h4 className="priceTitle">Total: </h4>
                <h4 className="status-false">{numberFormat(total)}</h4>
              </Col>
            </Row>
            <hr/>
            <Button color="primary" type="submit">
            <IoAddOutline/> ADD
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </Form>
          

        </ModalBody>
      </Modal>
    </div>
  );
};

export default ModalExample;
