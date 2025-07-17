import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar.js";
import { useAuth } from "../../App.js";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <img src="/logo192.png" alt="Stack Overflow" className="logo-img" />
            <span className="logo-text">
              stack<span className="logo-bold">overflow</span>
            </span>
          </Link>

          <nav className="nav">
            <Link to="/" className="nav-link">
              About
            </Link>
            <Link to="/" className="nav-link">
              Products
            </Link>
            <Link to="/" className="nav-link">
              For Teams
            </Link>
          </nav>
        </div>

        <div className="header-center">
          <SearchBar onSearch={handleSearch} placeholder="Search..." />
        </div>

        <div className="header-right">
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <div className="user-avatar">
                  {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="user-name">{user?.username || "User"}</span>
              </div>
              <button className="btn btn-outline" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Log in
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
