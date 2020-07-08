import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Welcome.scss";

// Logos
import cslogo from "../../images/cs-logo-light.webp";
import sass from "../../images/sass-logo.webp";
import html from "../../images/html-logo.webp";
import btstrap from "../../images/bootstrap-logo.webp";
import cSharp from "../../images/cSharp.webp";
import rbs from "../../images/rbs-logo.webp";
import vue from "../../images/vue-logo.webp";
import ps from "../../images/ps-logo.webp";
import postman from "../../images/postman-logo.webp";
import java from "../../images/java-logo.webp";
import github from "../../images/github-logo.webp";
import nodejs from "../../images/nodejs-logo.webp";
import git from "../../images/git-logo.webp";
import js from "../../images/js-logo.webp";
import ai from "../../images/ai-logo.webp";
import sql from "../../images/mysql-logo.webp";
import css from "../../images/css-logo.webp";
import react from "../../images/react-logo.webp";
import flutter from "../../images/flutter-logo.webp";
import dart from "../../images/dart-logo.webp";

function Welcome() {
  return (
    <Link to="/info">
      <div className="wlcm-page-wrap">
        <div className="left-wrapper">
          <div className="wlcm-content">
            <img src={cslogo} alt="CS Logo" />
            <div className="wlcm-ln1">welcome</div>
            <div className="wlcm-ln2">to my portfolio</div>
            <div className="wlcm-ln3">
              I’m a Game and Web designer and developer who’s passion is to
              create
            </div>
            <div className="wlcm-ln4">Click anywhere to continue...</div>
          </div>
        </div>
        <div className="logo-wrapper">
          <img className="react logo" src={react} alt="react-logo.png" />
          <img className="cSharp logo" src={cSharp} alt="C#.png" />
          <img className="bootstrap logo" src={btstrap} alt="btstp-logo.png" />
          <img className="html logo" src={html} alt="html-logo.png" />
          <img className="vue logo" src={vue} alt="vue-logo.png" />
          <img className="sass logo" src={sass} alt="sass-logo.png" />
          <img className="postman logo" src={postman} alt="postman-logo.png" />
          <img className="ps logo" src={ps} alt="ps-logo.png" />
          <img className="github logo" src={github} alt="github-logo.png" />
          <img className="java logo" src={java} alt="java-logo.png" />
          <img className="nodejs logo" src={nodejs} alt="nodejs-logo.png" />
          <img className="git logo" src={git} alt="git-logo.png" />
          <img className="js logo" src={js} alt="js-logo.png" />
          <img className="ai logo" src={ai} alt="ai-logo.png" />
          <img className="sql logo" src={sql} alt="sql-logo.png" />
          <img className="css logo" src={css} alt="css-logo.png" />
          <img className="rbs logo" src={rbs} alt="rbs-logo.png" />
          <img className="flutter logo" src={flutter} alt="flutter-logo.png" />
          <img className="dart logo" src={dart} alt="dart-logo.png" />
        </div>
      </div>
    </Link>
  );
}

export default Welcome;
