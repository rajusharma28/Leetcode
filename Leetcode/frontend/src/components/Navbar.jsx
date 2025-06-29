import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-4 items-center">
            <Link to="/" className="hover:text-blue-500">
              Home
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/progress" className="hover:text-blue-500">
                  Progress
                </Link>
                <Link to="/submissions" className="hover:text-blue-500">
                  Submissions
                </Link>
                <Link to="/progress" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                  Progress
                </Link>
                <Link to="/contests" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                  Contests
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-500">
                    Admin Panel
                  </Link>
                )}
                <span className="text-gray-700">
                  Welcome, {user?.username}
                </span>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-500">
                  Login
                </Link>
                <Link to="/signup" className="hover:text-blue-500">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;