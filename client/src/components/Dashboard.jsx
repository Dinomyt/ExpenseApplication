import { useState, useEffect } from "react";
import { Container, FormGroup, ListGroup } from "react-bootstrap";
import { Col, Row, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Accordion from 'react-bootstrap/Accordion';
import { useNavigate } from 'react-router-dom';
import { AddExpenseItems, checkToken, GetItemsByUserId, LoggedInData, updateExpenseItems } from "../Services/DataService";
import Spinner from 'react-bootstrap/Spinner';

const Dashboard = ({ isDarkMode, onLogin }) => {
  const [show, setShow] = useState(false);
  const [ExpenseDescription, setExpenseDescription] = useState('');
  const [ExpenseCategory, setExpenseCategory] = useState('');
  const [edit, setEdit] = useState(false);
  const [userId, setUserId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [ExpenseAmount, setExpenseAmount] = useState(0);
  const [ExpenseId, setExpenseId] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Dummy data useState
  const [ExpenseItems, setExpenseItems] = useState([]);
  let navigate = useNavigate();

  // Load data
  const loadUserData = async () => {
    let userInfo = LoggedInData();
    onLogin(userInfo);
    setUserId(userInfo.userId);
    console.log("User info:", userInfo);

    setTimeout(async () => {
      let userExpenseItems = await GetItemsByUserId(userInfo.userId);
      setExpenseItems(userExpenseItems);
      setIsLoading(false);
      console.log("Loaded expense items: ", userExpenseItems);
    }, 1000);
  };

  // useEffect is the first thing that fires onload.
  useEffect(() => {
    if (!checkToken()) {
      navigate('/Login');
    } else {
      loadUserData();
    }
  }, [navigate]);

  const handleSave = async ({ target: { textContent } }) => {
    let { userId } = LoggedInData();
    const published = {
      Id: edit ? ExpenseId : 0,
      UserId: userId,
      Description: ExpenseDescription,
      Category: ExpenseCategory,
      Amount: ExpenseAmount,
      IsPublished: textContent === "Save" || textContent === "Save Changes" ? false : true,
      IsDeleted: false,
    };
    console.log(published);
    handleClose();
    let result = false;
    if (edit) {
      result = await updateExpenseItems(published);
    } else {
      result = await AddExpenseItems(published);
    }

    if (result) {
      let userExpenseItems = await GetItemsByUserId(userId);
      setExpenseItems(userExpenseItems);
      console.log(userExpenseItems, "This is for our UserExpenseItems");
    } else {
      alert(`Expense items not ${edit ? "Updated" : "Added"}`);
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = (e, { id, userId, description, category, isDeleted, isPublished, amount }) => {
    setShow(true);
    if (e.target.textContent === 'Add Expense Item') {
      setEdit(false);
    } else {
      setEdit(true);
    }
    setExpenseAmount(amount);
    setExpenseId(id);
    setUserId(userId);
    setExpenseDescription(description);
    setExpenseCategory(category);
    console.log(e.target.textContent, edit);
  };

  const handleDescription = (e) => {
    setExpenseDescription(e.target.value);
  };

  const handleCategory = (e) => {
    setExpenseCategory(e.target.value);
  };

  const handleAmount = (e) => {
    setExpenseAmount(e.target.value);
  };

  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
  };

  const calculateTotalExpense = () => {
    return ExpenseItems
      .filter(item => selectedCategory === "All" || item.category === selectedCategory)
      .reduce((total, item) => total + (item.isPublished ? item.amount : 0), 0);
  };

  // Function to help us handle publish and unpublish
  const handlePublish = async (item) => {
    const { userId } = JSON.parse(localStorage.getItem("UserData"));
    item.isPublished = !item.isPublished;

    let result = await updateExpenseItems(item);
    if (result) {
      let userExpenseItems = await GetItemsByUserId(userId);
      setExpenseItems(userExpenseItems);
    } else {
      alert(`Expense item not ${edit ? "updated" : "Added"}`);
    }
  };

  // Delete function
  const handleDelete = async (item) => {
    item.isDeleted = !item.isDeleted;
    let result = await updateExpenseItems(item);
    if (result) {
      let userExpenseItems = await GetItemsByUserId(item.userId);
      setExpenseItems(userExpenseItems);
    } else {
      alert(`Expense item not ${edit ? "Updated" : "Added"}`);
    }
  };

  return (
    <>
      <Container className={isDarkMode ? 'bg-dark text-light p-5' : 'bg-light'} fluid>
        <Button variant="outline-primary m-2" onClick={(e) => handleShow(e, { id: 0, userId: userId, description: "", category: "", isDeleted: false, isPublished: false })}>
          Add Expense Item
        </Button>

        <Form.Group controlId="CategoryFilter" className="mb-3">
          <Form.Label>Filter by Category</Form.Label>
          <Form.Select value={selectedCategory} onChange={handleCategoryFilter}>
            <option value="All">All</option>
            <option value="Groceries">Groceries</option>
            <option value="Utils">Utils</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
          </Form.Select>
        </Form.Group>

        <h4>Total Expenses: ${calculateTotalExpense()}</h4>

        <Modal data-bs-theme={isDarkMode ? "dark" : "light"} show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{edit ? "Edit " : "Add "}Expense Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" placeholder="Enter Description" value={ExpenseDescription} onChange={handleDescription} />
              </Form.Group>
              <FormGroup controlId="Category">
                <Form.Label>Category</Form.Label>
                <Form.Select value={ExpenseCategory} onChange={handleCategory}>
                  <option>Select Category</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Utils">Utils</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                </Form.Select>
              </FormGroup>
              <FormGroup controlId="Amount">
                <Form.Label>Amount</Form.Label>
                <Form.Control 
                  type="number" 
                  value={ExpenseAmount} 
                  onChange={handleAmount} 
                  min="0" 
                  step="1" 
                  placeholder="Enter amount"
                />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="outline-primary" onClick={handleSave}>
              {edit ? "  Save Changes" : "Save"}
            </Button>
            <Button variant="outline-primary" onClick={handleSave}>
              {edit ? "  Save Changes" : "Save"} and Publish
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Accordion below */}
        {isLoading ? (
          <>
            <Spinner animation="grow" variant="info" />
            <h2>....Loading</h2>
          </>
        ) : (
          ExpenseItems.length === 0 ? (
            <h2 className="text-center">No Expense Items to Show.</h2>
          ) : (
            <Accordion defaultActiveKey={['0', '1']} alwaysOpen>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Published</Accordion.Header>
                <Accordion.Body>
                  <table className="table table-dark table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Description</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Category</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {ExpenseItems.filter(item => 
                        selectedCategory === "All" || item.category === selectedCategory
                      ).filter(item => item.isPublished).map((item, i) => (
                        <tr key={i}>
                          <td>{item.description}</td>
                          <td>{'$' + item.amount}</td>
                          <td>{item.category}</td>
                          <td>
                            <Col className="d-flex justify-content-end mx-2">
                              <Button variant="outline-danger mx-2" onClick={() => handleDelete(item)}>Delete</Button>
                              <Button variant="outline-info mx-2" onClick={(e) => handleShow(e, item)}>Edit</Button>
                              <Button variant="outline-primary mx-2" onClick={() => handlePublish(item)}>Unpublish</Button>
                            </Col>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Unpublished</Accordion.Header>
                <Accordion.Body>
                  <table className="table table-dark table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Description</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Category</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {ExpenseItems.filter(item => 
                        selectedCategory === "All" || item.category === selectedCategory
                      ).filter(item => !item.isPublished).map((item, i) => (
                        <tr key={i}>
                          <td>{item.description}</td>
                          <td>{'$' + item.amount}</td>
                          <td>{item.category}</td>
                          <td>
                            <Col className="d-flex justify-content-end mx-2">
                              <Button variant="outline-danger mx-2" onClick={() => handleDelete(item)}>Delete</Button>
                              <Button variant="outline-info mx-2" onClick={(e) => handleShow(e, item)}>Edit</Button>
                              <Button variant="outline-primary mx-2" onClick={() => handlePublish(item)}>Publish</Button>
                            </Col>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          )
        )}
      </Container>
    </>
  );
};

export default Dashboard;
