import React, { useState, useEffect } from "react";
import { getWithAuth, put } from "../../../../Utils/httpHelper";
import "./ModalEdtUser.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdModeEdit } from "react-icons/md";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

toast.configure();
const ModalAdd = (props) => {
  const { id } = props;
  const [modal, setModal] = useState(false);
  const [user, setUser] = useState(Object);
  const [checkName, setCheckName] = useState(true);
  const [nameError, setNameError] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [today, setToday] = useState("");
  const [gender, setGener] = useState(false);

  const toggle = () => setModal(!modal);

  useEffect(() => {
    if (modal) {
      getWithAuth(`/persons/search/${id}`).then((response) => {
        if (response.status === 200) {
          // console.log(response.data);
          setUser(response.data);
          setGener(response.data.gender);
        }
      });
      setNameError("");
      setEmailError("");
      setAddressError("");
      setDate();
    }
  }, [modal]);
  async function checkEmailExist(email, id) {
    if (checkName && addressError == "")
      getWithAuth(`/persons/checkEmailUpdate?email=${email}&id=${id}`).then(
        (response) => {
          if (response.status === 200) {
            if (response.data) {
              setCheckEmail(true);
              // setEmailError("");
            } else {
              setEmailError("This email has been used");
            }
          }
        }
      );
  }
  async function handleFieldChange(e, key) {
    setUser({ [key]: e.target.value });
    if (key === "email") {
      setUser({ [key]: e.target.value });
      setEmailError("");
    } else if (key === "fullname") {
      setUser({ [key]: e.target.value });
      if (e.target.value.trim() == "") {
        setNameError("Name must not blank");
        setCheckName(false);
      } else {
        setNameError("");
        setCheckName(true);
      }
    } else if (key === "address") {
      setUser({ [key]: e.target.value });
      if (e.target.value.trim() == "") {
        setAddressError("Address must not blank");
      } else {
        setAddressError("");
      }
    } else if (key === "phonenumber") {
      setUser({ [key]: e.target.value.replace(/\D/, "") });
      // setPhonenumber(e.target.value.replace(/\D/, ""));
    } else if (key === "genderFemale"){
      if (!gender){
        setGener(true);
      }
    } else if (key === "genderMale"){
      if (gender){
        setGener(false);
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const id = e.target.id.value.trim();

    checkEmailExist(email, id);
    if (checkEmail && checkName && addressError == "") {
      const body = JSON.stringify({
        id: e.target.id.value,
        fullname: e.target.fullname.value.trim(),
        email: e.target.email.value.trim(),
        gender: e.target.radio.value,
        dob: e.target.dob.value,
        phonenumber: e.target.phonenumber.value,
        address: e.target.address.value.trim(),
      });
      console.log(body);
      // console.log(e.target.dob.value);

      put(`/persons/${id}`, body)
        .then((response) => {
          console.log(response.data);
          if (response.data === "SUCCESS")
            toast.success("Edit successfully!!!", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 3000,
            });
        })
        .catch((error) => {
          toast.error("Add failed, please check again", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
          console.log(error);
        });
    }
  }
  function setDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }

    today = yyyy + "-" + mm + "-" + dd;
    setToday(today);
  }
  return (
    <div>
      <Button color="warning" onClick={toggle}>
        <MdModeEdit />
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          <MdModeEdit /> User Information
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <FormGroup>
              <Label for="exampleEmail">ID</Label>
              <Input
                type="text"
                name="id"
                id="exampleEmail"
                value={user.id}
                required
                disabled
              />
            </FormGroup>
            <FormGroup>
              <Label for="exampleFullName">Name</Label>
              <Input
                type="text"
                name="fullname"
                id="exampleFullName"
                value={user.fullname}
                required="required"
                onChange={(e) => handleFieldChange(e, "fullname")}
              />
              <div style={{ color: "red" }}>{nameError}</div>
            </FormGroup>
            <FormGroup>
              <Label for="examplePrice">Email</Label>
              <Input
                type="email"
                name="email"
                id="examplePrice"
                value={user.email}
                required
                onChange={(e) => handleFieldChange(e, "email")}
              />
              <div style={{ color: "red" }}>{emailError}</div>
            </FormGroup>
            <FormGroup tag="fieldset" className="radioGr-user">
              <Label for="exampleQuantity">Gender</Label>
              <FormGroup check className="radioBtn-user">
                <Label check>
                  <Input
                    type="radio"
                    name="radio"
                    value="false"
                    required
                    checked={!gender}
                    onChange={(e) => handleFieldChange(e, "genderMale")}
                  />{" "}
                  MALE
                </Label>
              </FormGroup>
              <FormGroup check className="radioBtn-user">
                <Label check>
                  <Input
                    type="radio"
                    name="radio"
                    value="true"
                    checked={gender}
                    onChange={(e) => handleFieldChange(e, "genderFemale")}
                  />{" "}
                  FEMALE
                </Label>
              </FormGroup>
            </FormGroup>
            <FormGroup>
              <Label for="exampleBrand">Day of Birth</Label>
              <Input
                type="date"
                name="dob"
                id="exampleBrand"
                max={today}
                value={user.dob} //{format(new Date(user.dob), "YYYY-MM-DD")}
                //{user.dob.toISOString().substr(0,10)}
                onChange={(e) => handleFieldChange(e, "dob")}
              />
            </FormGroup>
            <FormGroup>
              <Label for="exampleEmail">Phonenumber</Label>
              <Input
                type="text"
                name="phonenumber"
                id="exampleEmail"
                required
                minLength="10"
                maxLength="10"
                value={user.phonenumber}
                onChange={(e) => handleFieldChange(e, "phonenumber")}
              />
            </FormGroup>
            <FormGroup>
              <Label for="exampleAddress">Address</Label>
              <Input
                type="text"
                name="address"
                id="exampleAddress"
                value={user.address}
                required
                onChange={(e) => handleFieldChange(e, "address")}
              />
              <div style={{ color: "red" }}>{addressError}</div>
            </FormGroup>
            <br />
            <Button outline color="warning" type="submit">
              <MdModeEdit /> Edit
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

export default ModalAdd;
