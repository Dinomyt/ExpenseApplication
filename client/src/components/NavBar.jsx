import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { IoSunnyOutline } from "react-icons/io5";
import { FaRegMoon } from "react-icons/fa";
import Moon from "../assets/moon.jpg";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavBar = ({ isDarkMode, toggleDarkMode, user,isLoggedIn,setIsLoggedIn }) => {


  const handleLogout = () => 
  {
    localStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
      
    
  }

  return (
    <>
      <Navbar
        collapseOnSelect
        data-bs-theme={`${isDarkMode ? "dark" : "light"}`}
        expand="lg"
        className={`${isDarkMode ? "bg-dark text-light" : "bg-body-tertiary"}`}
        fixed="top"
      >
        <Container>
          <Navbar.Brand href="#home">Our Daily Expense</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to={"/Dashboard"}>
                Dashboard
              </Nav.Link>
            </Nav>
            
            
            <Nav className="welcome">
              <Nav.Link href="#deets">
                {isDarkMode ? (
                  <FaRegMoon onClick={toggleDarkMode} fontSize={20} />
                ) : (
                  <IoSunnyOutline onClick={toggleDarkMode} fontSize={30} />
                )}
              </Nav.Link>

              <Nav.Link as={Link} to={"/CreateAccount"}>
                Create Account
              </Nav.Link>
              {isLoggedIn ? <Nav.Link as={Link} to={"/Login"} onClick={handleLogout} >
                Logout
              </Nav.Link> : <Nav.Link as={Link} to={"/Login"}>
                Login
              </Nav.Link>  }
              
              
             
              <Nav.Link>Welcome {user ? user.publisherName : "Guest"}</Nav.Link>
              <Nav.Link>
                <Image className="profilepic" src={Moon} roundedCircle />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;