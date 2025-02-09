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
  const [selectedContactIndex, setSelectedContactIndex] = useState(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null); // Track the open dropdown for each contact


  const toggleDropdown = (index) => {
    // If the same contact is clicked, toggle it; otherwise, open the new one
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
        setstorecontact((getarray) => [...getarray, res.data]);
        setname('');
        setphoneno('');
        setfocus(false); // Hide add form
      })
      .catch(console.error);
  };

  function handlemenu() {
    setfocus(true);
  }

  const handlecancle = () => {
    setfocus(false);
  };

  return (
    <div id="main">
      <div className="container">
        {storecontact.map((user, index) => (
          <div id='showcontact' key={index}>
            <h2>
              <h2 id='contactname'>{user.ContactName}</h2>
              <h2 id='contactnumber'>{user.ContactNo}</h2>
            </h2>

            <div>
              <FontAwesomeIcon
                icon={faChevronRight}
                id='icon'
                onClick={() => toggleDropdown(index)} // Toggle the specific contact's dropdown
                style={{
                  transform: openDropdownIndex === index ? 'rotate(90deg)' : 'rotate(0deg)', // Rotate the icon when the dropdown is open
                  transition: 'transform 0.3s ease',
                }}
              />
            </div>

            {openDropdownIndex === index && (
              <div className="contact-info">
                <div className='contactinformation'>
                  <p><strong>Name:</strong> {user.ContactName}</p>
                  <p><strong>Phone:</strong> {user.ContactNo}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {!focus && <button id="addbutton" onClick={handlemenu}>Add</button>}

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
              placeholder="Phone NO" 
              value={phoneno} 
              onChange={(e) => setphoneno(e.target.value)} 
            />
            <div id="addbut">
              <button id="button1" onClick={adduser}>Add</button>
              <button id="button2" onClick={handlecancle}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
