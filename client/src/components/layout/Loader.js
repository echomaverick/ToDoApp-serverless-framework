import React from "react";
import ReactLoading from "react-loading";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <ReactLoading type="bars" color="#0000FF" height={100} width={50} />
    </div>
  );
}
