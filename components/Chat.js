import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Table, Form, Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

function Chat() {
    const [userName, setUserName] = useState('');
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const history = useNavigate();
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null); 
    const [notification, setNotification] = useState(false);
  
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.username) {
            setUser(user);
            setUserName(user.username);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/users', {
                    params: { email: userName }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userName]);

    useEffect(() => {
        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);
    
        newSocket.on('connect', () => {
            newSocket.emit('client_ready');
        });
    
        newSocket.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
            if (selectedUser && selectedUser._id === message.senderId) {
                showNotification(message.content);
            }
        });
    
        return () => {
            newSocket.disconnect();
        };
    }, [selectedUser]);
  
    useEffect(() => {
        if (selectedUser) {
       
            fetchMessages(selectedUser._id);
        }
    }, [selectedUser]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        history('/');
    };

    const handleStartChat = async (user) => {
        setSelectedUser(user);
    };

    const fetchMessages = async (receiverId) => {
        try {
            const response = await axios.get('/messages', {
                params: {
                    senderId: user ? user._id : '',
                    receiverId: receiverId
                }
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = () => {
        if (messageInput.trim() !== '' && selectedUser && user && user._id) {
            const message = { senderId: user._id, receiverId: selectedUser._id, content: messageInput };
            if (socket) {
              
                socket.emit('message', message);
                
                setMessageInput('');
            }
        }
    };

    const showNotification = (message) => {
        alert(`New Message from ${selectedUser.username}: ${message}`);
        setNotification(true); 
    };
    const handleSearch = async () => {
        try {
            const response = await axios.get('/users', {
                params: { search: searchInput }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };


    return (
        <>
            <div className='chat-nav'>
                <Navbar className='chatbar'>
                    <Nav.Link href="#home"></Nav.Link>
                    <Image className="chat-logo" src="/pic.jpg"></Image>

                    <div className='chat-head'>
                        <h2>
                            Hello {userName ? userName : 'Guest'}, Let's chat
                        </h2>
                    </div>

                    <div className='navlogout'>
                        <Link to="/Profile">
                            <Button variant='outline-dark'>Profile <i className="fa-regular fa-user"></i></Button>
                        </Link>
                        <span style={{ marginRight: '10px' }}></span>
                        <Button variant='outline-dark' onClick={handleLogout}>Log out</Button>
                    </div>
                </Navbar>
            </div>

            <div className='bodychat2'>
                <h2 className="chathead12"><br />Chats  <i className="fa-regular fa-message"></i></h2>
                <div className='bodychat'>
                
                    <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search or start a new chat"
                            className="me-2"
                            aria-label="Search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <Button variant="outline-dark" onClick={handleSearch}>
                            <i className="fa-brands fa-searchengin"></i>
                        </Button>
                    </Form>
                    <br />
                </div>
                <Table className="custom-table">
                    <thead></thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>  <Button  className="chatpepl"variant='outline-light' onClick={() => handleStartChat(user)}>{user.username}      </Button></td>
                                {/* <td>
                                  
                                        
                              
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <div className='chatspot'>
                <div className='chatspot2'>
                    {/* Selected user's chat interface */}
                    {selectedUser ? (
                        <div className="chat-container">
                            {/* <p className='paragraph'>User</p> */}
                            <h2 className='userclick'><Image className='propic' src='/pro.jpg'></Image>{selectedUser.username}</h2>
                            <p className='paragraph'>User</p>
                            <div className='messages-container'>
                                <ul className='messages-list'>
                                    {messages.map((message, index) => (
                                        <li
                                            key={index}
                                            className={message.senderId === user._id ? 'sent-message' : 'received-message'}
                                        >
                                            {message.content}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='keyboard'>
                                <input
                                    className='form-control'
                                    type="text"
                                    value={messageInput}
                                    placeholder='Send your message'
                                    onChange={(e) => setMessageInput(e.target.value)}
                                />
                                <Button className="send" onClick={sendMessage} variant='outline-light'><i className="fa-solid fa-paper-plane"></i></Button>
                            </div>
                        </div>
                    ) : (

                        <div><br></br><br></br>
                            <h2 className='msgalert'>Send and Receive your messages</h2>
                            <h5 className='msgalert'>End-to-end encrypted <i className="fa-solid fa-lock"></i></h5><br></br>
                            <Image className="lockdp" src="/pic.jpg"></Image>                        
                        </div>                       
                    )}
                </div>
            </div>
            {notification && <div className="notification">New message received!</div>}
        </>
    );
}

export default Chat;
