import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useToast } from '../context/ToastContext';

export default function ProfilePhoto({
  size = 150,
  onPhotoSelected,
}) {
  const user = useSelector((state) => state.auth.user);
  const { showToast } = useToast();
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // Use the saved photo URL supplied by the backend.
  const savedPhoto =
    user?.profile_photo_url ??
    user?.photo_url ??
    user?.photo ??
    null;

  // Release the temporary preview URL when it changes or unmounts.
  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Accept image files only.
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.');
      e.target.value = '';
      return;
    }

    // Limit the file size to 5 MB.
    if (file.size > 5 * 1024 * 1024) {
      showToast('The image must be 5 MB or smaller.');
      e.target.value = '';
      return;
    }

    // Preview the image locally.
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Allow the parent to upload the original File to the backend.
    if (onPhotoSelected) {
      onPhotoSelected(file);
    }

    showToast('Photo preview updated.');
    e.target.value = '';
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  const displayedPhoto = preview || savedPhoto;

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
      {displayedPhoto ? (
        <img
          src={displayedPhoto}
          alt="Profile"
          className="profile-photo-img"
        />
      ) : (
        <svg
          viewBox="0 0 24 24"
          width="60"
          height="60"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
      )}

      <div className="profile-photo-overlay">
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="profile-photo-input"
        onChange={handleFile}
        hidden
      />
    </div>
  );
}