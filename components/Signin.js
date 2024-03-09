import { Button, Form ,Col,Row,Container} from 'react-bootstrap';
import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';


function Signin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e) {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      if (token && user && user.email === email) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        navigate('/Chat', { replace: true });
      } else {
        alert('Authentication failed. Email may not be registered.');
      }
    } catch (error) {
      alert('Error occurred while logging in.');
      console.error(error);
    }
  }
    return(
<div className="Signinhead">
<div className="signincontainer">
    <Container>
        <Row className="justify-content-center">
    <Col md={6}>
        <div className="regbox"><br></br>
            <h3 className="reghead">Sign-In</h3><br></br>
            <Form onSubmit={submit}>

              
<input className='form-control'
  type="email"
  name="email"
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email" /><br></br>
<input className='form-control'
  type="password"
  name="password"
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Password" /><br></br>
              
                <div className="signbot">
        <Button variant="outline-dark"type="submit">Sign-In</Button>
        <br>
        </br> <br>
        </br>  <h4 className="warning">If you haven't Signed-up</h4><h4 className="warning"><Link to="/SignUp"> Create a new account</Link></h4><br>
</br>      <Link to="/"><Button variant="outline-dark"> <i class="fa-solid fa-home"></i></Button></Link>
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
export default Signin