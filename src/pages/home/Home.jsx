import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Home.scss";
import "../../styles/Projects.scss";

import afp from "../../images/AFPShowcase.jpg";
import bloglab from "../../images/BlogLab.jpg";
import cavco from "../../images/CavcoHomes.jpg";
import fuelrewards from "../../images/FuelRewards.jpg";
import fueland from "../../images/FuelandInc.jpg";
import devmountain from "../../images/DevMountain.jpg";
import drino from "../../images/DrinoShowcase.jpg";
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
      <div className="projects-page">
        <div className="projects-wrap">
          <div className="showcase-wrap">
            <div className="showcase">
              <img className="proj-img" src={cavco} alt="cavco-showcase" />
            </div>
            <div className="text">
              <div className="title-wrap">
                <h1>Cavco Industries, Inc.</h1>
              </div>
              <p className="desc">
                Cavco Industries is a leading builder of Manufactured Homes,
                Modular Homes, Park Model RVs, Commercial Buildings and Vacation
                Cabins in the United States.
              </p>
              <p className="desc">
                At Cavco Industries, I maintained the parent and sister company
                websites through Jira tickets involving a wide variety of
                front-end related problems, that I was able to quickly resolve
                by utilizing my expertise in, but not excluded to:
              </p>
              <ul>
                <li>React/Typescript</li>
                <li>Google Maps API</li>
                <li>Advanced data handling</li>
                <li>CMS management</li>
                <li>Chat GPT prompts</li>
              </ul>
            </div>
          </div>
          <div className="showcase-wrap">
            <div className="showcase">
              <img className="proj-img" src={fueland} alt="drino-showcase" />
            </div>
            <div className="text">
              <div className="title-wrap">
                <h1>Fueland Inc</h1>
              </div>
              <p className="desc">
                At Fueland Inc I developed the landing page and signup form for
                businesses to register their company and stores with the
                Fueland's Fuel Reward program.
              </p>
              <p>It involved a number of technologies such as:</p>
              <ul>
                <li>React/Typescript</li>
                <li>Login/Registration functionality</li>
                <li>Responsive form selections</li>
                <li>Password resetting</li>
                <li>Signeasy form signing</li>
                <li>Java backend</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="projects-wrap">
          <div className="showcase-wrap">
            <div className="showcase">
              <a
                href="https://www.fuelrewards.com/"
                target="_blank"
                rel="noopener noreferrer"
                alt="Fuel Rewards"
              >
                <img
                  className="proj-img"
                  src={fuelrewards}
                  alt="fuel-rewards-showcase"
                />
              </a>
            </div>
            <div className="text">
              <div className="title-wrap">
                <h1>Fuel Rewards Connect</h1>
              </div>
              <p className="desc">
                At PDI Technologies I developed and maintained the front-end
                Javascript workflow for Fuel Rewards Connect utilizing HTML,
                CSS, JavaScript, Nunjucks, SASS, JSON, jQuery and Gulp building
                the login, registration and success pages for sponsors of Shell
                like Bank of America, Reddit, Sonesta, Red Bull, Dunkin Donuts,
                CarAdvise, American Airlines, and many more.
              </p>
              <p>Features Include:</p>
              <ul>
                <li>Registration processes</li>
                <li>Login functionality</li>
                <li>CMS Utilization</li>
                <li>Responsive form selections</li>
                <li>Password resetting</li>
                <li>Gulp workflows</li>
              </ul>
            </div>
            <div className="project-footer-wrap">
              <a
                href="https://www.fuelrewards.com/"
                target="_blank"
                rel="noopener noreferrer"
                alt="Fuel Rewards"
              >
                <img
                  id="logo-fr"
                  src="https://ed0c37be21f8ad72418b-ae99f0738c1a4f0c153c7aecac9360e1.ssl.cf1.rackcdn.com/2020/fuel-rewards-logo-1A.svg"
                  alt="Fuel Rewards"
                />
              </a>
              <a
                href="https://pditechnologies.com/"
                target="_blank"
                rel="noopener noreferrer"
                alt="PDI Technologies"
              >
                <img
                  id="logo-pdi"
                  src="https://pditechnologies.com/wp-content/uploads/2022/06/PDI_Logo.svg"
                  alt="PDI Technologies"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="header-wrap">
          <h2>Personal Projects</h2>
        </div>
        <div className="projects-page">
          <div className="projects-wrap">
            <div className="showcase-wrap">
              <div className="showcase">
                <a
                  href="https://bloglab.live/"
                  target="_blank"
                  rel="noopener noreferrer"
                  alt="BlogLab"
                >
                  <img
                    className="proj-img"
                    src={bloglab}
                    alt="bloglab-showcase.png"
                  />
                </a>
              </div>
              <div className="text">
                <div className="title-wrap">
                  <h1>BlogLab</h1>
                  <a
                    name="github"
                    className="github-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/cwshields/bloglab-web"
                  >
                    <Github />
                    <div id="github-link" className="display-none">
                      Github Link
                    </div>
                  </a>
                </div>
                <p className="desc">
                  BlogLab is my current personal project that I'm building where
                  a user will be able to post, edit and share blogs, listings,
                  podcasts, guides and more.
                </p>
                <div className="features-wrap">
                  <div className="features">
                    <p>Current features:</p>
                    <ul>
                      <li>Data driven home page</li>
                      <li>Advanced routing</li>
                      <li>Custom Logo Design</li>
                      <li>Axios Hooks API</li>
                      <li>AWS backend</li>
                      <li>Post sorting</li>
                    </ul>
                  </div>
                  <div className="features">
                    <p>Coming soon:</p>
                    <ul>
                      <li>Blog posting/editing</li>
                      <li>Login functionality</li>
                      <li>Brand Shop</li>
                      <li>Contact form</li>
                      <li>Tag constructors</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <h3>Older Projects:</h3>
            <div className="showcase-wrap">
              <div className="showcase">
                <img
                  className="proj-img"
                  src={drino}
                  alt="drino-showcase.png"
                />
              </div>
              <div className="text">
                <div className="title-wrap">
                  <h1>Drino</h1>
                  <a
                    name="github"
                    className="github-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/cwshields/drino-app"
                  >
                    <Github />
                    <div id="github-link" className="display-none">
                      Github Link
                    </div>
                  </a>
                </div>
                <p className="desc">
                  This is a full-stack project I built for both sides of a
                  buisiness; customer/employee relations. It is a fully RESTful
                  design that includes:
                </p>
                <ul>
                  <li>Landing page</li>
                  <li>Login functionality</li>
                  <li>Data statistics</li>
                  <li>Customizable employee profile</li>
                  <li>Contact form</li>
                  <li>Administrator inbox</li>
                  <li>Employee information list</li>
                  <li>Template pages</li>
                </ul>
              </div>
            </div>
            <div className="showcase-wrap">
              <div className="showcase">
                <img className="proj-img" src={afp} alt="afp-showcase.png" />
              </div>
              <div className="text">
                <div className="title-wrap">
                  <h1>Andy Fancher Presents</h1>
                  <a
                    name="github"
                    className="github-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/cwshields/AFP"
                  >
                    <Github />
                    <div id="github-link" className="display-none">
                      Github Link
                    </div>
                  </a>
                </div>
                <p className="desc">
                  When he was 9 years old, Andy Fancher, found WWII memorabilia
                  that inspired him to know more, but little to no information
                  was known about the veterans he found. It later inspired him
                  to go on a mission to find the untold stories of these heroes
                  so the world could better know them in what became Andy
                  Fancher Presents. On this platform, he could document these
                  stories for the world to see and hear for themselves.
                </p>
                <p className="desc">
                  His journey inspired me, knowing that so many amazing stories
                  have been lost over time, so I used how I could help to design
                  this website for him in hopes it could help his journey be
                  successful.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="header-wrap">
          <h2>Education</h2>
        </div>
        <div className="projects-page">
          <div className="projects-wrap">
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
