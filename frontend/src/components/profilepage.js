import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import ProfileDashboard from './Profile';
import ProfileSidebar from './ProfileSidebar';

const ProfilePage = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <ProfileSidebar />
        </div>
        <div className="col-md-1">
          <ProfileDashboard />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
