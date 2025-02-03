import React, { useState } from 'react';
     import axios from 'axios';
     import { useNavigate } from 'react-router-dom';
     const Login = () => {
         const [username, setUsername] = useState('');
         const [password, setPassword] = useState('');
          const [message, setMessage] = useState('');
         const navigate = useNavigate();


         const handleSubmit = async (e) => {
             e.preventDefault();
             try {
                 const response = await axios.post('http://localhost:5000/auth/login', {
                 username,
                 password,
                });
                localStorage.setItem('token', response.data.token)
                 setMessage('Logged in successfully!');
                 if(response.data.isAdmin){
                      navigate('/admin')
                 } else{
                      navigate('/');
                 }


             } catch (error) {
                  if (error.response && error.response.data && error.response.data.message) {
                     setMessage(error.response.data.message);
                  } else {
                    setMessage("An error occurred");
                 }

             }
         };

         return (
           <div>
                <h2>Login</h2>
               {message && <p>{message}</p>}
              <form onSubmit={handleSubmit}>
                 <input
                     type="text"
                     placeholder="Username"
                     value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
               <input
                     type="password"
                    placeholder="Password"
                     value={password}
                    onChange={(e) => setPassword(e.target.value)}
                     required
                 />
               <button type="submit">Log In</button>
             </form>
           </div>
         );
     };

     export default Login;