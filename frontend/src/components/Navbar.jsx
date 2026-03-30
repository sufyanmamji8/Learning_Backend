import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-violet-400" />
          <span className="text-lg font-bold gradient-text">TodoApp</span>
        </div>

        <div className="flex items-center gap-4">
          {user?.name && (
            <span className="text-sm text-gray-400">
              Hey, <span className="text-gray-200 font-medium">{user.name}</span>
            </span>
          )}
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
