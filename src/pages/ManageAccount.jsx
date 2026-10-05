import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProfilePhoto from '../components/ProfilePhoto';
import { useToast } from '../context/ToastContext';
import { getUserById, updateUser, updateUserPassword } 
from '../services/userService';

import '../layout.css';
import './ManageAccount.css';

function EditIcon() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width="15" 
      height="15" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.8"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg 
      className="row-chevron" 
      viewBox="0 0 24 24" 
      width="16" 
      height="16" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function ManageAccount( {onClose} ) {
  const { user, token } = useSelector((state) => state.auth);
  const [account, setAccount] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    employeeNumber: "",
    position: "",
    departmentName: "",
    roleName: "",
  });

  const [passwordForm, setPasswordForm] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const [language, setLanguage] = useState(
  localStorage.getItem("language") || "English"
);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const [headEditing, setHeadEditing] = useState(false);
  const [aboutEditing, setAboutEditing] = useState(false);
  const [openPanels, setOpenPanels] = useState({});

  const togglePanel = (id) => {
    setOpenPanels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {

    async function loadAccount() {
      if (!token || !user?.userId){
        return;
      }
      try {
        setLoading(true);

        const result = await getUserById(
          token, user.userId
        );
/* 
        console.log("Manage Account user:", result);
        console.log(token, user?.userId)
 */
        const accountData = result?.data ?? result;
/* 
        console.log("Redux user:", user);
        console.log("Redux roleId:", user?.roleName);
  */
      setAccount({
        ...accountData,
        roleName: user.roleName,
      });
        // console.log("account data:", accountData);

        setForm({
          firstName: accountData.first_name ?? "",
          lastName: accountData.last_name ?? "",
          email: accountData.email ?? "",
          contactNumber: accountData.contact_number ?? "",
          employeeNumber: accountData.employee_number ?? "",
          position: accountData.position ?? "",
          departmentName: accountData.department_name ?? "",
          roleName: user.roleName ?? "",
        });
      } catch (error) {
        console.error(
          "Failed to load account:", error
        );
      } finally {
        setLoading(false);
      }
    }
    loadAccount();
  }, [token, user?.userId]);

  const handleSaveProfile = async () => {
  if (!token || !user?.user_id || !account) {
    return;
  }

  try {
    setSaving(true);

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      departmentId: account.departmentId,
      contactNumber: form.contactNumber,
      employeeNumber: account.employeeNumber,
      position: form.position,
      roleName: account.roleName
    };

    const result = await updateUser(
      token, user.user_id, payload
    );

    console.log("Account update response:", result);

    showToast("Profile updated");

    setHeadEditing(false);

  } catch (error) {
    console.error("Failed to update account:", error);

    showToast(error.message || "Failed to update profile");

  } finally {
    setSaving(false);
  }
};

const handlePasswordUpdate = async () => {
  if (!token || !user?.user_id) {return;}

  if (!passwordForm.newPassword) {
    showToast("Enter a new password");
    return;
  }

  if (
    passwordForm.newPassword !==
    passwordForm.confirmPassword
  ) {showToast("Passwords do not match");
     return;
  }

  try {
    await updateUserPassword(
      token,
      user.user_id,
      passwordForm.newPassword
    );

    showToast("Password updated");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  } catch (error) {
    console.error(
      "Password update failed:",
      error
    );

    showToast(
      error.message || "Password update failed"
    );
  }
};

const handleLanguageSave = () => {
  localStorage.setItem("language", language);

  showToast("Language preference saved");
};

return (
    <div className="manage-account-overlay" onClick={onClose}>

      {/* <Navbar active="profile" /> */}
      <div
        className="manage-account-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="manage-account-close"
            onClick={onClose}
            aria-label="Close"
          >
            x
          </button>
        <section className="account-panel">

          <div className="profile-head">
                <ProfilePhoto />

            <div className="profile-details">
              {headEditing ? (
                <div className="profile-edit-form">

                  <label>
                    First Name
                    <input
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Last Name
                    <input
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Position
                    <input
                      value={form.position}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          position: e.target.value,
                        })
                      }
                    />
                  </label>
                  
                  <label>
                    Email
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Contact Number
                    <input
                      value={form.contactNumber}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          contactNumber: e.target.value,
                        })
                      }
                    />
                  </label>

                </div>
                ) : (
                  <>
                    <h1 className="profile-name">
                      {form.firstName} {form.lastName}
                    </h1>

                    <h3  className="profile-role">
                      {form.employeeNumber} - {form.roleName}
                    </h3>

                    <span className="profile-role">
                      {form.position} - {form.departmentName}
                    </span>
                    <p className="profile-contact">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="2"
                          y="4"
                          width="20"
                          height="16"
                          rx="2"
                        />
                        <path d="M2 6l10 7 10-7" />
                      </svg>

                      <span>{form.email}</span>
                    </p>

                    <p className="profile-contact">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 0 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2.2z" />
                      </svg>

                      <span>{form.contactNumber}</span>
                    </p>
                  </>
                )}
            </div>
                  <button className="edit-btn" id="edit-head" onClick={() => {
                    if (headEditing) {
                      handleSaveProfile();
                    } else {setHeadEditing(true);}
                  }}
                  disabled={saving}
                  >
                    <EditIcon />
                    <span>{headEditing ? 'Done' : 'Edit'}</span>
                  </button>
          </div>

              <div className="about-block">
                <div className="about-head">
                  <h2>About</h2>
                  <button className="edit-btn" id="edit-about" onClick={() => setAboutEditing((v) => !v)}>
                    <EditIcon />
                    <span>{aboutEditing ? 'Done' : 'Edit'}</span>
                  </button>
                </div>

                <p id="about-text">committed to ensuring secure, efficient, and uninterrupted IT operations while providing quality technical support to employees and company systems.</p>
              </div>

          <div className="settings-grid">

                <div className="settings-card">
                  <h3>
                    <svg viewBox="0 0 24 24"
                      width="20" 
                      height="20" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.6"
                    >
                      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
                    </svg>
                    Account Security
                  </h3>

                  <div className="settings-item">
                    <button className="settings-row" 
                      aria-expanded={!!openPanels['panel-password']} 
                      onClick={() => togglePanel('panel-password')}
                    >
                      <svg viewBox="0 0 24 24" 
                        width="18" 
                        height="18" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.6"
                      >
                        <rect x="4" y="10" width="16" height="10" rx="2" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                      <span>Change Password</span>
                      <ChevronIcon />
                    </button>
                    <div className="settings-panel" hidden={!openPanels['panel-password']}>
                      <label>
                      Current Password
                      <input
                        type="password"
                        placeholder="Enter current password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                      />
                      </label>

                      <label>
                        New Password
                        <input
                          type="password"
                          placeholder="Enter new password"
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        Confirm New Password
                        <input
                          type="password"
                          placeholder="Re-enter new password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </label>

                      <button
                        className="panel-save"
                        type="button"
                        onClick={handlePasswordUpdate}
                      >
                        Save Password
                      </button>
                    </div>
                  </div>

                    {/* Ignore this */}
                  <div className="settings-item">
                    <button className="settings-row" 
                    aria-expanded={!!openPanels['panel-devices']} 
                    onClick={() => togglePanel('panel-devices')}>
                      <svg viewBox="0 0 24 24" 
                      width="18" height="18" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.6"
                      >
                        <rect x="3" y="4" 
                        width="18" 
                        height="12" 
                        rx="1" 
                        />
                        <path d="M2 20h20" />
                      </svg>
                      <span>Your Netrust Devices</span>
                      <ChevronIcon />
                    </button>
                    <div className="settings-panel" hidden={!openPanels['panel-devices']}>
                      <div className="device-row">
                        <div>
                          <p className="device-name">Laptop</p>
                          <p className="device-name">Mobile Phone</p>
                        </div>
                        <div>
                          <p className="device-meta">LPT0001</p>
                          <p className="device-meta">CP0001</p>
                        </div>
                        <div>
                          <p className="device-meta">LENOVO IdeaPad</p>
                          <p className="device-meta">Samsung Galaxy A06</p>
                        </div>
                        <div>
                          <p className="device-meta">SN: PF5W173V</p>
                          <p className="device-meta">IMEI: 351233871087963</p>
                        </div>
                        {/* <span className="device-tag">This device</span> */}
                      </div>

                      <div>
                        <div className="device-header">
                          <p>
                            <svg
                              viewBox="0 0 24 24"
                              width="18"
                              height="18"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="6"
                                y="3"
                                width="12"
                                height="18"
                                rx="6"
                              />
                              <path d="M12 3v6" />
                              <path d="M12 6h.01" />
                            </svg>
                          </p>
                          
                          <p style={{marginLeft: "8px"}}>Other Accessories</p>

                        </div>
                        <div className="device-row">
                          <div>
                            <p className="device-name">Mouse</p>
                            <p className="device-name">Headset</p>
                          {/* <button className="panel-remove">Remove</button> */}
                          </div>
                          <div>
                            <p className="device-meta">MSE0001</p>
                            <p className="device-meta">HSE0001</p>
                          </div>
                          <div>
                            <p className="device-meta">Lenovo BT Wifi</p>
                            <p className="device-meta">Lenovo BTX HS</p>
                          </div>
                          <div>
                            <p className="device-meta">SN: AAA555</p>
                            <p className="device-meta">SN: BBB444</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="settings-item">
                    <button className="settings-row" aria-expanded={!!openPanels['panel-history']} onClick={() => togglePanel('panel-history')}>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
                      <span>Login History</span>
                      <ChevronIcon />
                    </button>
                    <div className="settings-panel" hidden={!openPanels['panel-history']}>
                      <div className="history-row"><span>Aug 6, 2026 — 9:14 AM</span><span>Chrome on Windows</span></div>
                      <div className="history-row"><span>Aug 4, 2026 — 6:02 PM</span><span>Safari on iPhone</span></div>
                      <div className="history-row"><span>Aug 1, 2026 — 8:47 AM</span><span>Chrome on Windows</span></div>
                    </div>
                  </div>
                </div>

                <div className="settings-card">
                  <h3>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>
                    Account Preferences
                  </h3>

                  <div className="settings-item">
                    <button className="settings-row" aria-expanded={!!openPanels['panel-language']} onClick={() => togglePanel('panel-language')}>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" /></svg>
                      <span>Language</span>
                      <ChevronIcon />
                    </button>
                    <div className="settings-panel" hidden={!openPanels['panel-language']}>
                      <label>Display Language
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        >
                          <option value="English">English</option>
                          <option value="Filipino">Filipino</option>
                          <option value="Cebuano">Cebuano</option>
                        </select>
                      </label>

                      <button className="panel-save" type="button" onClick={handleLanguageSave}>Save Language</button>

                    </div>
                  </div>
                </div>
          </div>
        </section>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
