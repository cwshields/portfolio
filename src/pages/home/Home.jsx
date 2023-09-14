import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Home.scss";
import "../../styles/Projects.scss";


import meImg from "../../images/me.jpg";
import meAngryImg from "../../images/me-angry.jpg";

import sass from "../../images/logos/sass-logo.png";
import html from "../../images/logos/html-logo.png";
import bootstrap from "../../images/logos/bootstrap-logo.png";
import vue from "../../images/logos/vue-logo.png";
import github from "../../images/logos/github-logo.png";
import nodejs from "../../images/logos/nodejs-logo.png";
import git from "../../images/logos/git-logo.png";
import js from "../../images/logos/js-logo.png";
import sql from "../../images/logos/mysql-logo.png";
import aws from "../../images/logos/aws-logo.png";
import figma from "../../images/logos/figma-logo.png";
import ai from "../../images/logos/ai-logo.png";
import css from "../../images/logos/css-logo.png";
import react from "../../images/logos/react-logo.png";
import typescript from "../../images/logos/typescript_logo.png";
import rbs from "../../images/logos/rbs-logo.png";
import LinkedIn from "../../components/SocialMedia/LinkedIn";
import Github from "../../components/SocialMedia/Github";
import Twitter from "../../components/SocialMedia/Twitter";

import proExpData from "../../data/professionalExperience";
import personalExpData from "../../data/personalProjects";
import Showcase from "../../components/Showcase/Showcase";

import devmountain from "../../images/DevMountain.jpg";

const imagesPath = {
  meImg: meImg,
  meAngryImg: meAngryImg,
};

const Home = () => {
  const [mad, setMad] = useState(false);

  const toggleImg = () => {
    setMad(true);
    setTimeout(() => {
      setMad(false);
    }, 1000);
  };

  const getImageName = () => {
    return mad ? "meAngryImg" : "meImg";
  };

  return (
    <div>
      <div className="info-wrapper">
        <div className="left-wrap">
          <div className="info-wrap">
            <div className="info">
              <div className="img-div">
                <img
                  src={imagesPath[getImageName()]}
                  className={mad ? "me me-angry" : "me"}
                  alt="me.png"
                />
                <div className="egg1" onClick={toggleImg}>
                  don't click me...
                </div>
              </div>
              <div className="info-div">
                <div className="info-content">
                  <div className="name">
                    <div className="first">Chase</div>
                    <div className="last">Shields</div>
                  </div>
                  <a
                    className="email"
                    href="mailto:cwshields2@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    cwshields2@gmail.com
                  </a>
                  <div className="media">
                    <a
                      className="media-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.linkedin.com/in/chase-shields-236bb4126/"
                    >
                      <LinkedIn />
                      <div id="linkedin-link" className="display-none">
                        Linkedin Link
                      </div>
                    </a>
                    <a
                      name="github"
                      className="media-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://github.com/cwshields/"
                    >
                      <Github />
                      <div id="github-link" className="display-none">
                        Github Link
                      </div>
                    </a>
                    <a
                      name="twitter"
                      className="media-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://twitter.com/ChaseShields6"
                    >
                      <Twitter />
                      <div id="twitter-link" className="display-none">
                        Twitter Link
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="desc">
              <p>
                I'm a full-stack web developer always looking for an opportunity
                to solve problems, learn, and grow in a positive environment
                with motivated, supportive people.
              </p>
              <p>Scroll down to check out some of my work!</p>
              <p>
                Beta:{" "}
                <Link className="scrabble-link" to="/scrabble-game">
                  Words with Friends clone
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="stack-wrap">
          <div className="frameworks-wrap">
            <div className="fw stack-text">frameworks</div>
            <img className="react logo" src={react} alt="React" />
            <img className="vue logo" src={vue} alt="Vue" />
          </div>
          <div className="libraries-wrap">
            <div className="lib stack-text">libraries</div>
            <img className="bootstrap logo" src={bootstrap} alt="Bootstrap" />
            <img className="rbs logo" src={rbs} alt="React Bootstrap" />
            <img className="sass logo" src={sass} alt="SASS" />
          </div>
          <div className="fundamentals-wrap">
            <div className="funds stack-text">fundamentals</div>
            <img className="html logo" src={html} alt="HTML" />
            <img className="css logo" src={css} alt="CSS" />
            <img className="js logo" src={js} alt="JavaScript" />
            <img
              className="typescript logo"
              src={typescript}
              alt="Typescript"
            />
          </div>
          <div className="backend">
            <div className="be stack-text">backend</div>
            <img className="sql logo" src={sql} alt="SQL" />
            <img className="nodejs logo" src={nodejs} alt="NodeJS" />
            <img className="aws logo" src={aws} alt="AWS" />
          </div>
          <div className="design-wrap">
            <div className="design stack-text">design</div>
            <img className="figma logo" src={figma} alt="Figma" />
            <img className="ai logo" src={ai} alt="Illustrator" />
          </div>
          <div className="version-control">
            <div className="vc stack-text">version control</div>
            <img className="github logo" src={github} alt="Github" />
            <img className="git logo" src={git} alt="Git" />
          </div>
        </div>
      </div>
      <div className="header-wrap">
        <h2>Professional Experience</h2>
      </div>
      <div className="experience-container">
        <div className="experience-wrap">
          {proExpData.map((data, index) => (
            <Showcase data={data} key={index} />
          ))}
        </div>
        <div className="header-wrap">
          <h2>Personal Projects</h2>
        </div>
        <div className="experience-container">
          <div className="experience-wrap">
            {personalExpData.map((data, index) => (
              <Showcase data={data} key={index} />
            ))}
          </div>
        </div>
        <div className="header-wrap">
          <h2>Education</h2>
        </div>
        <div className="experience-container">
          <div className="experience-wrap">
            <div className="showcase-wrap">
              <div className="showcase">
                <a
                  href="https://devmountain.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  alt="DevMountain"
                >
                  <img
                    className="proj-img"
                    src={devmountain}
                    alt="drino-showcase.png"
                  />
                </a>
              </div>
              <div className="text">
                <div className="title-wrap">
                  <h1>DevMountain</h1>
                </div>
                <p className="desc">
                  In 2019, I graduated from DevMountain from the Full-stack Web
                  Development course. While I was there I learned a myriad of
                  technologies and development techniques in order to thrive in
                  the field of web development.
                </p>
                What I learned:
                <ul>
                  <li>Full-stack Web Development</li>
                  <li>RESTful API integration</li>
                  <li>CRUD Operations</li>
                  <li>React</li>
                  <li>UI/UX</li>
                  <li>Javascript</li>
                  <li>Typescript</li>
                  <li>Node.js</li>
                  <li>SASS</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
