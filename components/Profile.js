import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form,Image } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
const history = useNavigate
  useEffect(() => {
    // Load user details from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
    setEditedUser(user);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      // Send a PUT request to update user details in the MongoDB collection
      const response = await axios.put(`/profile/users/${user._id}`, editedUser);

      if (response.data) {
        // Update the user state with the edited details
        setUser(response.data);
        setEditMode(false);
      } else {
        console.error('Failed to update user details');
      }
    } catch (error) {
      console.error('Failed to update user details', error);
    }
  };

  const handleDelete = async (userId) => {
    try {

      await axios.delete(`/api/users/${userId}`);
  
   
      localStorage.removeItem('user');
      setUser(null);
      // Redirect the user to the home page after deleting their account
      history.push('/');
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };
  return (
    <div className='reg'>
    <div className='profile'>
      <div className='userframe'>
        <h1 className='head5'>User Profile</h1>
        <Image className='userpic' src="https://img.freepik.com/premium-vector/user-chat-message-icon-people-with-speech-bubble-symbol-neumorphism-style-vector-eps-10_532800-824.jpg"></Image>
        {editMode ? (
          <Form>
            <Form.Group>
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type='text'
                name='username'
                value={editedUser.username || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type='email'
                name='email'
                value={editedUser.email || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          
              
            <Button variant='outline-light' onClick={handleSaveClick}>
              Save
            </Button>
          </Form>
        ) : user ? (
          <div className='head5'>
            <h3>Name: {user.username}</h3>
            <h5>Email: {user.email}</h5>
            
          </div>
        ) : (
          <p>No user details found .</p>
        )}
        {!editMode && (
          <Button className='bot1' variant='outline-light' onClick={handleEditClick}>
            Edit   < i class="fa-regular fa-pen-to-square"></i>
          </Button>
        )}<br></br><br></br>
      <Button variant="outline-danger" onClick={() => handleDelete(user._id)}>
  Delete account <i class="fa-solid fa-trash"></i>
</Button><br></br><br>
</br>

        <Link to='/Chat'>
          <Button className='bot1' variant='outline-light'>
Back to <i class="fa-regular fa-message"></i>          </Button>
        </Link>
      </div>
    </div>
    </div>
  );
}

export default Profile;
