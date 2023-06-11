import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Welcome.scss";

// Logos
import cslogo from "../../images/logos/cs-logo-light.png";
import sass from "../../images/logos/sass-logo.png";
import html from "../../images/logos/html-logo.png";
import btstrap from "../../images/logos/bootstrap-logo.png";
import cSharp from "../../images/logos/cSharp.png";
import rbs from "../../images/logos/rbs-logo.png";
import vue from "../../images/logos/vue-logo.png";
import ps from "../../images/logos/ps-logo.png";
import postman from "../../images/logos/postman-logo.png";
import java from "../../images/logos/java-logo.png";
import github from "../../images/logos/github-logo.png";
import nodejs from "../../images/logos/nodejs-logo.png";
import git from "../../images/logos/git-logo.png";
import js from "../../images/logos/js-logo.png";
import ai from "../../images/logos/ai-logo.png";
import sql from "../../images/logos/mysql-logo.png";
import css from "../../images/logos/css-logo.png";
import react from "../../images/logos/react-logo.png";
import flutter from "../../images/logos/flutter-logo.png";
import dart from "../../images/logos/dart-logo.png";

function Welcome() {
  return (
    <Link to="/home">
      <div className="wlcm-page-wrap">
        <div className="left-wrapper">
          <div className="wlcm-content">
            <img src={cslogo} alt="CS Logo" />
            <div className="wlcm-ln1">welcome</div>
            <div className="wlcm-ln2">to my portfolio</div>
            <div className="wlcm-ln3">
              I'm a Web designer and developer whose passion is to
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
