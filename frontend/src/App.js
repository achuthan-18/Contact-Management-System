import './app.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [storecontact, setstorecontact] = useState([]);
  const [name, setname] = useState('');
  const [phoneno, setphoneno] = useState('');
  const [focus, setfocus] = useState(false);
  const [editFocus, setEditFocus] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then((res) => setstorecontact(res.data))
      .catch(console.error);
  }, []);

  const adduser = () => {
    axios.post('http://localhost:3001/users', { ContactName: name, ContactNo: phoneno })
      .then((res) => {
        setstorecontact((prevContacts) => [...prevContacts, res.data]);
        setname('');
        setphoneno('');
        setfocus(false);
      })
      .catch(console.error);
  };

  const deleteUser = (id) => {
    axios.delete(`http://localhost:3001/users/${id}`)
      .then(() => {
        setstorecontact((prevContacts) => prevContacts.filter((user) => user._id !== id));
      })
      .catch(console.error);
  };

  const editUser = () => {
    if (!selectedContact) return;
    
    axios.put(`http://localhost:3001/users/${selectedContact._id}`, { ContactName: name, ContactNo: phoneno })
      .then((res) => {
        setstorecontact((prevContacts) =>
          prevContacts.map((user) => user._id === selectedContact._id ? res.data : user)
        );
        setname(''); 
        setphoneno('');
        setEditFocus(false);
        setSelectedContact(null); 
      })
      .catch(console.error);
  };

  function handlemenu() {
    setfocus(true);
  }

  function handleeditmenu(user) {
    setEditFocus(true);
    setSelectedContact(user);
    setname(user.ContactName); 
    setphoneno(user.ContactNo);
  }

  const handlecancle = () => {
    setfocus(false);
  };

  const handleeditcancle = () => {
    setEditFocus(false);
    setSelectedContact(null);
    setname('');
    setphoneno('');
  };

  return (
    <div id="main">
      <div className="container">
        <header>Contact Management System</header>
        {storecontact.map((user, index) => (
          <div id='showcontact' key={user._id}>
            <div id='show1' onClick={() => toggleDropdown(index)}>
              <div id='show2'>
                <h2 id='contactname'>{user.ContactName}</h2>
                <h2 id='contactnumber'>{user.ContactNo}</h2>
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  id='icon'
                  style={{
                    transform: openDropdownIndex === index ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </div>
            </div>

            {openDropdownIndex === index && (
              <div className="contact-info">
                <div className='contactinformation'>
                  <p><strong>Name:</strong> {user.ContactName}</p>
                  <p><strong>Phone:</strong> {user.ContactNo}</p>
                </div>
                <div className='contacteditdelete'>
                  <button className='contactedit' onClick={() => handleeditmenu(user)}>Edit</button>
                  <button className='contactdelete' onClick={() => deleteUser(user._id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {!focus && <button id="addbutton" onClick={handlemenu}>+</button>}

        {focus && (
          <div id="adduser">
            <h1>Add Contact</h1>
            <input 
              type="text" 
              placeholder="Contact Name" 
              value={name} 
              onChange={(e) => setname(e.target.value)} 
            />
            <input 
              type="tel" 
              placeholder="Mobile Number" 
              value={phoneno} 
              onChange={(e) => setphoneno(e.target.value)} 
            />
            <div id="addbut">
              <button id="button1" onClick={adduser}>Add</button>
              <button id="button2" onClick={handlecancle}>Cancel</button>
            </div>
          </div>
        )}

        {editFocus && selectedContact && (
          <div id="adduser">
            <h1>Update Contact</h1>
            <input 
              type="text" 
              placeholder="Contact Name" 
              value={name} 
              onChange={(e) => setname(e.target.value)} 
            />
            <input 
              type="tel" 
              placeholder="Mobile Number" 
              value={phoneno} 
              onChange={(e) => setphoneno(e.target.value)} 
            />
            <div id="addbut">
              <button id="button1" onClick={editUser}>Update</button>
              <button id="button2" onClick={handleeditcancle}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
