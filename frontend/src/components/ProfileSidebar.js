import React from 'react';

function ProfileSidebar() {
  return (
    <div className="profile-sidebar">
      <div className="list-group">
        <button className="list-group-item list-group-item-action" onClick={() => console.log("View Interested Events")}>View Interested Events</button>
        <button className="list-group-item list-group-item-action" onClick={() => console.log("Booked Events")}>Booked Events</button>
        <button className="list-group-item list-group-item-action" onClick={() => console.log("Paid Events")}>Paid Events</button>
        {/* Add more options/buttons as needed */}
      </div>
    </div>
  );
}

export default ProfileSidebar;
