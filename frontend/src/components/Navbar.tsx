import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="w-full glass py-3">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-36 flex items-center justify-center">
            <img src="/logo_complete.svg" alt="PlayPals" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* User Area */}
        <div className="relative" ref={menuRef}>
          {user && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all active:scale-95"
            >
              <span className="text-sm font-semibold text-(--color-text-primary) hidden sm:block">{user.nickname}</span>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-(--color-error)/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
