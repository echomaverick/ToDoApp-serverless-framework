import React, { useState } from "react";
import ReactLoading from "react-loading";
import "../styles/home.css";
import Logo from "../images/logoi.webp";
import {BsInstagram} from 'react-icons/bs';
import {BsTwitter} from 'react-icons/bs';
import {BsFacebook} from 'react-icons/bs';
import {BsLinkedin} from 'react-icons/bs';

const Home = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        " https://your-api-id.execute-api.us-west-2.amazonaws.com/dev/api/emails/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail("");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
    }

    setIsLoading(false);
  };

  return (
    <div className="big-home">
      <div className="home">
        <div className="home-container">
          <h2>
            Proventus Nexus brings <br /> all your tasks, projects,
            <br /> and teams together in one.
          </h2>
        </div>
        <div className="keep-container">
          <p>Keep everything in the same place-even if your team isn't.</p>
        </div>
        <input
          type="email"
          className="email-input"
          placeholder="Enter your email address"
          value={email}
          onChange={handleEmailChange}
        />
        <div className="signup-container">
          <a className="signup-button" href="/signup">
            Subscribe - it's free
          </a>
        </div>

        <div className="image">
          <img src={Logo} alt="logo" />
        </div>
      </div>

      <div className="home2">
        <p className="home-text2">Proventus 101</p>
        <div className="home-container2">
          <h2>Workflows for any project, big or small</h2>
        </div>

        <div className="card-carousel">
          <div className="proventus-cards">
            <div className="card-bar1"></div>
            <h3> Project management</h3>
            <p>
              Keep tasks in order, deadlines on track, and team members aligned
              with Trello.
            </p>
          </div>
          <div className="proventus-cards">
            <div className="card-bar2"></div>
            <h3>Task management</h3>
            <p>
              Use Trello to track, manage, complete, and bring tasks together
              like the pieces of a puzzle, and make your team’s projects a
              cohesive success every time.
            </p>
          </div>
          <div className="proventus-cards">
            <div className="card-bar3"></div>
            <h3>Brainstorming</h3>
            <p>
              Unleash your team’s creativity and keep ideas visible,
              collaborative, and actionable.
            </p>
          </div>
        </div>

        <div className="our-use-case">
          <h4>No need to start from scratch. Jump-start your workflow with a proven playbook <br/>designed for different teams. Customize it to make it yours.</h4>
          <a href="/" className="use-case-button">Learn more</a>
        </div>
      </div>

      <div className="footer">
        <div className="footer-container">
          <ul>
            <li><a href="/privacy">Privacy</a></li>
            <li><a href="/terms">Terms</a></li>
            <li>Copyright © 2023<a href="/">Proventus Nexus</a></li>
            <li>&nbsp;</li>
            <li>&nbsp;</li>
            <li>&nbsp;</li>
            <li>&nbsp;</li>
            <li>&nbsp;</li>
            <li>&nbsp;</li>
            <li>&nbsp;</li>
            <li>&nbsp;</li>
            <li>&nbsp;</li>
            <li>
             <a href="https://www.instagram.com/_samueldervishi_"> <BsInstagram /></a>
            </li>
            <li>
            <a href="https://www.twitter.com/samueldervishii"> <BsTwitter /></a> 
            </li>
            <li>
            <a href="https://www.facebook.com/samueldervishii"> <BsFacebook /></a>
            </li>
            <li>
            <a href="https://www.linkedin.com/in/samueldervishi"> <BsLinkedin /></a>
            </li>
          </ul>
          
        </div>
      </div>
    </div>
  );
};

export default Home;
