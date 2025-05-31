import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';

import List from './pages/List';
import Create from './pages/Create'
import Login from './components/Login';
import Edit from './pages/Edit'
import { ToastContainer } from 'react-toastify';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr className='opacity-25' />
          <div className='flex w-full'>
            <div className='w-[70%] mx-auto ml-[max(15vw,10px)] my-8 text-gray-600 text-base'>
              <Routes>
                {/* Add this home route: */}
                <Route path='/' element={<h1>Welcome Admin Panel</h1>} />

                
                <Route path='/list' element={<List token={token} />} />
                
                 <Route path="/list/create" element={<Create token={token} />} />
                 <Route path="/list/edit/:id" element={<Edit token={token} />} />


              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
