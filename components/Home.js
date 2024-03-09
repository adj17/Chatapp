import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
function Home(){
    return(
        <><div className='Topbar'>
            <Navbar className='Navbar'>
                <Container className='con1'><Image className='img1' src="/pic.jpg"></Image></Container></Navbar>
              </div>
        <div className='logreg'><br></br><br></br><br></br>
        <Link to="/Signin"><Button className='bot' variant="outline-dark">SIGN-IN</Button></Link>
<br></br>
<br></br>
<Link to="/SignUp"><Button className='bot' variant="outline-dark">SIGN-UP</Button></Link><br></br>
<br></br><br></br>

<h3 className='botmname'> Welcome to </h3>
<h3 className='botmname1'>  Hello Chat </h3>
            </div></>
    )
}
export default Home;