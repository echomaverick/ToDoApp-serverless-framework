import React from "react";

const NotAuthorized = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="shadow p-5">
            <h2 className="text-center mb-4">Not Authorized</h2>
            <p>You are not authorized to access this page.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
