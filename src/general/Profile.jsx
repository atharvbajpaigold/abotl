import React from 'react';

const Profile = () => {
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user')); } catch (e) { user = null; }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      {user ? (
        <div className="bg-white p-4 rounded shadow">
          <p><strong>Name:</strong> {user.username || user.name || '—'}</p>
          <p><strong>Email:</strong> {user.email || '—'}</p>
          {user.imageURL && <img src={user.imageURL} alt="profile" className="w-24 h-24 rounded-full mt-3" />}
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default Profile;
