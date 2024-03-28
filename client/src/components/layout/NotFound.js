import React, { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center" }}>404 - Not Found</h1>
    </div>
  );
};

export default NotFound;
