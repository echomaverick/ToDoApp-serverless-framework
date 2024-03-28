import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

const ConfirmationPage = () => {
  const { email } = useParams();
  const [confirmationStatus, setConfirmationStatus] = useState("pending");
  const history = useHistory();

  useEffect(() => {
    async function confirmSubscription() {
      try {
        const response = await fetch(
          ` https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/api/emails/confirm/${encodeURIComponent(
            email
          )}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          setConfirmationStatus("confirmed");

          setTimeout(() => {
            history.push("/");
          }, 2000);
        } else {
          setConfirmationStatus("error");
          console.error("Confirmation error:", response.statusText);
        }
      } catch (error) {
        setConfirmationStatus("error");
        console.error("An error occurred:", error);
      }
    }

    confirmSubscription();
  }, [email, history]);

  return (
    <div style={{ textAlign: "center", fontFamily: "Poppins, sans-serif" }}>
      <h1>Subscription Confirmation</h1>
      {confirmationStatus === "confirmed" && (
        <p>Your subscription has been confirmed. Thank you!</p>
      )}
      {confirmationStatus === "error" && (
        <p>There was an error confirming your subscription.</p>
      )}
    </div>
  );
};

export default ConfirmationPage;
