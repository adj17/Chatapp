import Button from "react-bootstrap/esm/Button";
import {Container,Row,Col,Form}from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
function SignUp(){
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
       
        
      });
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = async (e) => {
        // e.preventDefault();
        try {
          const response = await fetch('/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          // Handle the response as needed (e.g., show a success message).
        } catch (error) {
          console.error('Registration failed:', error);
        }
      };
    return(
<div className="Signinhead">
<div className="signincontainer">
    <Container>
        <Row className="justify-content-center">
    <Col md={6}>
        <div className="regbox"><br></br>
            <h3 className="reghead">Sign-Up</h3><br></br>
            <Form onSubmit={handleSubmit}>
            
            <input className='form-control'
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      /><br></br>
      <input  className='form-control'
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      /><br></br>
      <input  className='form-control'
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        /><br></br>
                <div className="signbot">
                <Button variant="outline-dark" type="submit">Sign-Up</Button>
        <br>
        </br> <br>
        </br>
        <Link to="/"><Button variant="outline-dark"> <i class="fa-solid fa-home"></i></Button></Link>
    </div>
            </Form>
        </div>
    </Col>
        </Row>
    </Container>
    
</div>
</div>
    )
}
export default SignUp