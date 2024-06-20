import React from "react";
import { Link } from "react-router-dom";
import authService from "../services/auth.service";


const NavComponent = ({currentUser, setCurrentUser}) => {
  const handleLogout = () => {
    authService.logout(); //remove the user from local storage
    window.alert("You have been logged out, you will be redirected to the home page.");
    setCurrentUser(null);
  };

  return (
    <div>
      <nav>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link active" to="/">
                    首页
                  </Link>
                </li>

                {!currentUser && ( <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    注册会员
                  </Link>
                </li>
                )}

                {!currentUser && (<li className="nav-item">
                  <Link className="nav-link" to="/login">
                    会员登录
                  </Link>
                </li>
                )}

                {currentUser && (<li className="nav-item">
                  <Link onClick={handleLogout} className="nav-link" to="/">
                    登出
                  </Link>
                </li>
                )}

                {currentUser && (<li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    个人首页
                  </Link>
                </li>
              )}

                {currentUser && (<li className="nav-item">
                  <Link className="nav-link" to="/course">
                    课程页面
                  </Link>
                </li>
                )}

                {currentUser && currentUser.user.role =="instructor" &&(<li className="nav-item">
                  <Link className="nav-link" to="/postCourse">
                    新增课程
                  </Link>
                </li>
                )}

                {currentUser && currentUser.user.role =="student" &&(<li className="nav-item">
                  <Link className="nav-link" to="/enroll">
                    注册课程
                  </Link>
                </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </nav>
    </div>
  );
};

export default NavComponent;
