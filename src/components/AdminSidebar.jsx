import React, { useState } from "react";
import { NavLink  } from "react-router-dom";
import { useSelector } from "react-redux";
import { getInitials } from "../utils/getInitials";
import ManageAccount from "../pages/ManageAccount";

const AdminSidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const [showManageAccount, setShowManageAccount] = useState(false);
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const role = user?.roleName;
  const department = user?.departmentName;

  const isSuperAdmin = role === "Super admin";
  const isAdmin = role === "Admin";

  if (!isSuperAdmin && !isAdmin) {
    return null;
  }

  const displayRole = isSuperAdmin ? "Super Admin" : "Admin";


  return (
    <aside className="admin-sidebar">
      <NavLink className="admin-logo" 
        to={isSuperAdmin ? "/superadmin/dashboard" : "/admin"}>
        <img 
          src="/assets/hpnavbarlogo.png" 
          alt="Netrust Philippines Corporation" 
        />
      </NavLink>

      <div className="admin-user-card">
        <div className="admin-user-card-top">
          <div className="admin-user-avatar">
            {getInitials(fullName)}
          </div>

          <div>
            <p className="admin-user-name">{fullName}</p>
            <p className="admin-user-role">{displayRole}</p>
            <p className="admin-user-dept">{department} Test</p>
          </div>
        </div>

        <button
            className="manage-account"

            type="button"
            onClick={() => setShowManageAccount(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 22 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="10" cy="10.4" r="2.3" />
            <path d="m15 11 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.1 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 1.8Z" />
          </svg>
            Manage Your Account
        </button>
        {showManageAccount && (
          <ManageAccount
          onClose={() => setShowManageAccount(false)}
        />
      )}
{/*         <NavLink       
          className={`admin-nav-link${
            active === "dashboard" ? " active" : ""}`}
        > Manage Your Account
        </NavLink> */}
      </div>

      <nav className="admin-nav">
        <p className="admin-nav-label">Overview</p>


        <NavLink 
          to="/superadmin/dashboard"
          className={({ isActive }) =>
            `admin-nav-link${isActive ? " active" : ""}`
        }
        >
          <svg 
            viewBox="0 0 24 24" 
            width="18" height="18" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.8"
          >
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>          
          Dashboard
        </NavLink>

{/* Uncomment this once announcement is allowed */}
{/* <p className="admin-nav-label">Contents</p>
        <Link 
          to="/admin/announcements" 
          className={`admin-nav-link${
            active === "announcements" ? " active" : ""
          }`}
        >
          <svg 
            viewBox="0 0 24 24" 
            width="18" 
            height="18" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.8"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
          Announcement
        </Link> */}
        
        <NavLink 
          to="/admin/materials" 
          className={({ isActive }) =>
            `admin-nav-link${isActive ? " active" : ""}`}
        >
          <svg 
            viewBox="0 0 24 24" 
            width="18" height="18" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.8"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          Materials
        </NavLink>

        {isSuperAdmin && (
          <>
            <p className="admin-nav-label">Profile</p>
            <NavLink 
              to="/superadmin/users" 
              className={({ isActive }) =>
                `admin-nav-link${isActive? " active" : ""}`
              }
            >
              <svg 
                viewBox="0 0 24 24" 
                width="18" 
                height="18" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.8"
              >
                <circle cx="9" cy="8" r="3.2" />
                <path d="M2.5 19c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" />
                <circle cx="17" cy="8" r="2.6" />
                <path d="M15 13.3c2.6.5 4.5 2.6 4.5 5.7" />
              </svg>
              Usersie
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}

export default AdminSidebar;