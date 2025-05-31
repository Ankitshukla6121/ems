import { Link } from 'react-router-dom';

function Navbar({setToken}) {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow">
     
      <div className="flex space-x-6">
        <Link to="/" className="hover:underline " setToken={setToken}>Home</Link>
        <Link to="/list" className="hover:underline">Employee List</Link>
      </div>
      <div className="flex space-x-4 items-center">
        <span>Admin</span>
        <button onClick={()=>setToken('')} className='bg-gray-600 text-white px-5 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer'>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
