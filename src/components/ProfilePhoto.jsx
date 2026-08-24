import React, { useRef } from 'react';
import { useProfile } from '../context/ProfileContext';

export default function ProfilePhoto({ size = 150 }) {
  const { profile, updateProfile } = useProfile();
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateProfile({ photo: reader.result });
    reader.readAsDataURL(file);
  };

  const openPicker = () => inputRef.current && inputRef.current.click();

  return (
    <div
      className="profile-photo profile-photo-editable"
      style={{ width: size, height: size }}
      onClick={openPicker}
      role="button"
      tabIndex={0}
      aria-label="Upload profile photo"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPicker();
        }
      }}
    >
      {profile.photo ? (
        <img src={profile.photo} alt="Profile" className="profile-photo-img" />
      ) : (
        <svg viewBox="0 0 24 24" width="60" height="60" fill="currentColor">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
      )}

      <div className="profile-photo-overlay">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.svg,.avif,.heic"
        className="profile-photo-input"
        onChange={handleFile}
      />
    </div>
  );
}
