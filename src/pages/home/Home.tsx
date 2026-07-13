import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Home.scss";
import "../../styles/Projects.scss";

import meImg from "../../images/me.webp";
import meAngryImg from "../../images/me-angry.webp";

import sass from "../../images/logos/sass-logo.webp";
import html from "../../images/logos/html-logo.webp";
import bootstrap from "../../images/logos/bootstrap-logo.webp";
import vue from "../../images/logos/vue-logo.webp";
import github from "../../images/logos/github-logo.webp";
import nodejs from "../../images/logos/nodejs-logo.webp";
import git from "../../images/logos/git-logo.webp";
import js from "../../images/logos/js-logo.webp";
import sql from "../../images/logos/mysql-logo.webp";
import aws from "../../images/logos/aws-logo.webp";
import figma from "../../images/logos/figma-logo.webp";
import ai from "../../images/logos/ai-logo.webp";
import css from "../../images/logos/css-logo.webp";
import react from "../../images/logos/react-logo.webp";
import typescript from "../../images/logos/typescript_logo.webp";
import rbs from "../../images/logos/rbs-logo.webp";
import { LinkedIn, Github, Gmail } from "../../components/SocialMedia/SocialMedia";

import proExpData from "../../data/professionalExperience";
import personalExpData from "../../data/personalProjects";
import Showcase from "../../components/Showcase/Showcase";

import devmountain from "../../images/DevMountain.webp";

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
                  <div className="live-wrap">
                    <div className="live-dot-container">
                      <div className="live-dot"></div>
                      <div className="live-dot-pulse"></div>
                    </div>
                    <a
                      className="email"
                      href="mailto:cwshields2@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      cwshields2@gmail.com
                    </a>
                  </div>
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
                      className="media-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.gmail.com/"
                    >
                      <Gmail />
                      <div id="gmail-link" className="display-none">
                        Gmail Link
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
            </div>
          </div>
        </div>
        <div className="stack-wrap">
          <div className="frameworks-wrap">
            <div className="fw stack-text">frameworks</div>
            <img
              className="react logo"
              src={react}
              alt="React"
              title="ReactJS"
            />
            <img className="vue logo" src={vue} alt="Vue" title="VueJS" />
          </div>
          <div className="libraries-wrap">
            <div className="lib stack-text">libraries</div>
            <img
              className="bootstrap logo"
              src={bootstrap}
              alt="Bootstrap"
              title="Bootstrap"
            />
            <img
              className="rbs logo"
              src={rbs}
              alt="React Bootstrap"
              title="React Bootstrap"
            />
            <img className="sass logo" src={sass} alt="SASS" title="SASS" />
          </div>
          <div className="fundamentals-wrap">
            <div className="funds stack-text">fundamentals</div>
            <img className="html logo" src={html} alt="HTML" title="HTML" />
            <img className="css logo" src={css} alt="CSS" title="CSS" />
            <img
              className="js logo"
              src={js}
              alt="JavaScript"
              title="Javascript"
            />
            <img
              className="typescript logo"
              src={typescript}
              alt="Typescript"
              title="Typescript"
            />
          </div>
          <div className="backend">
            <div className="be stack-text">backend</div>
            <img className="sql logo" src={sql} alt="SQL" title="PostgreSQL" />
            <img
              className="nodejs logo"
              src={nodejs}
              alt="NodeJS"
              title="NodeJS"
            />
            <img
              className="aws logo"
              src={aws}
              alt="AWS"
              title="Amazon Web Services"
            />
          </div>
          <div className="design-wrap">
            <div className="design stack-text">design</div>
            <img className="figma logo" src={figma} alt="Figma" title="Figma" />
            <img
              className="ai logo"
              src={ai}
              alt="Illustrator"
              title="Illustrator"
            />
          </div>
          <div className="version-control">
            <div className="vc stack-text">version control</div>
            <img
              className="github logo"
              src={github}
              alt="Github"
              title="Github"
            />
            <img className="git logo" src={git} alt="Git" title="Git" />
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
                <img
                  className="proj-img"
                  src={devmountain}
                  alt="drino-showcase.png"
                />
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
                  <li>React v16</li>
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
