import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { signOut } from '../store/authSlice';

const NavBar: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(signOut());
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Hotel Reservations
        </Link>
        <div>
          <Link to="/" className="mr-4">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="mr-4">
                Dashboard
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">
                Login
              </Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
      {isAuthenticated && user && (
        <div className="container mx-auto mt-2">Welcome, {user.name}!</div>
      )}
    </header>
  );
};

export default NavBar;

