const data = {
  name: 'Test Name',
  email: 'test@example.com',
  phone: '1234567890',
  edit_type: 'Other',
  message: 'Test Message'
};

fetch('https://formsubmit.co/ajax/ranjittmishra21@gmail.com', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(res => res.json().then(body => ({ status: res.status, body })))
.then(console.log)
.catch(console.error);
