import React, { Component } from "react"
import "../../styles/Home.scss"
import "../../styles/Projects.scss"

import afp from "../../images/AFPShowcase.jpg"
import drino from "../../images/DrinoShowcase.jpg"
import meImg from "../../images/me.jpg"
import meAngryImg from "../../images/me-angry.jpg"
import sass from "../../images/sass-logo.png"
import html from "../../images/html-logo.png"
import bootstrap from "../../images/bootstrap-logo.png"
import vue from "../../images/vue-logo.png"
import github from "../../images/github-logo.png"
import nodejs from "../../images/nodejs-logo.png"
import git from "../../images/git-logo.png"
import js from "../../images/js-logo.png"
import sql from "../../images/mysql-logo.png"
import css from "../../images/css-logo.png"
import react from "../../images/react-logo.png"
import cSharp from "../../images/cSharp.png"
import rbs from "../../images/rbs-logo.png"

const imagesPath = {
  meImg: meImg,
  meAngryImg: meAngryImg,
};

new Image().src = meAngryImg

class Info extends Component {
  constructor() {
    super()
    this.state = {
      mad: false,
      imgClass: "me",
    }
  }

  toggleImg = () => {
    this.setState((state) => ({ mad: !state.mad }))
    setTimeout(() => {
      this.setState((state) => ({ mad: !state.mad }))
    }, 1000);
  }

  getImageName = () => {
    return this.state.mad ? "meAngryImg" : "meImg"
  }

  render() {
    const imageName = this.getImageName()
    return (
      <div>
        <div className="info-wrapper">
          <div className="left-wrap">
            <div className="info-wrap">
              <div className="info">
                <div className="img-div">
                  <img
                    src={imagesPath[imageName]}
                    className={this.state.mad ? "me me-angry" : "me"}
                    alt="me.png"
                  />
                  <div className="egg1" onClick={this.toggleImg}>
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
                        <svg
                          className="media-svg"
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-labelledby="linkedin-link"
                        >
                          <path
                            d="m437 0h-362c-41.351562 0-75 33.648438-75 75v362c0 41.351562 33.648438 75 75 
                            75h362c41.351562 0 75-33.648438 75-75v-362c0-41.351562-33.648438-75-75-75zm-256 406h-60v-210h60zm0-240h-60v-60h60zm210 240h-60v-120c0-16.539062-13.460938-30-30-30s-30 13.460938-30 30v120h-60v-210h60v11.308594c15.71875-4.886719 25.929688-11.308594 45-11.308594 40.691406.042969 75 36.546875 75 79.6875zm0 0"
                          />
                        </svg>
                        <div id="linkedin-link" className="display-none">Linkedin Link</div>
                      </a>
                      <a
                        name="github"
                        className="media-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/cwshields/"
                      >
                        <svg
                          className="media-svg"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          aria-labelledby="github-link"
                        >
                          <path
                            d="M255.968,5.329C114.624,5.329,0,120.401,0,262.353c0,113.536,73.344,209.856,175.104,243.872
                            c12.8,2.368,17.472-5.568,17.472-12.384c0-6.112-0.224-22.272-0.352-43.712c-71.2,15.52-86.24-34.464-86.24-34.464 c-11.616-29.696-28.416-37.6-28.416-37.6c-23.264-15.936,1.728-15.616,1.728-15.616c25.696,1.824,39.2,26.496,39.2,26.496 c22.848,39.264,59.936,27.936,74.528,21.344c2.304-16.608,8.928-27.936,16.256-34.368 c-56.832-6.496-116.608-28.544-116.608-127.008c0-28.064,9.984-51.008,26.368-68.992c-2.656-6.496-11.424-32.64,2.496-68 c0,0,21.504-6.912,70.4,26.336c20.416-5.696,42.304-8.544,64.096-8.64c21.728,0.128,43.648,2.944,64.096,8.672 c48.864-33.248,70.336-26.336,70.336-26.336c13.952,35.392,5.184,61.504,2.56,68c16.416,17.984,26.304,40.928,26.304,68.992 c0,98.72-59.84,120.448-116.864,126.816c9.184,7.936,17.376,23.616,17.376,47.584c0,34.368-0.32,62.08-0.32,70.496 c0,6.88,4.608,14.88,17.6,12.352C438.72,472.145,512,375.857,512,262.353C512,120.401,397.376,5.329,255.968,5.329z"
                          />
                        </svg>
                        <div id="github-link" className="display-none">Github Link</div>
                      </a>
                      <a
                        name="twitter"
                        className="media-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://twitter.com/ChaseShields6"
                      >
                        <svg
                          className="media-svg"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          aria-labelledby="twitter-link"
                        >
                          <path
                            d="M512,97.248c-19.04,8.352-39.328,13.888-60.48,16.576c21.76-12.992,38.368-33.408,46.176-58.016 
                          c-20.288,12.096-42.688,20.64-66.56,25.408C411.872,60.704,384.416,48,354.464,48c-58.112,0-104.896,47.168-104.896,104.992 
                          c0,8.32,0.704,16.32,2.432,23.936c-87.264-4.256-164.48-46.08-216.352-109.792c-9.056,15.712-14.368,33.696-14.368,53.056	c0,36.352,18.72,68.576,46.624,87.232c-16.864-0.32-33.408-5.216-47.424-12.928c0,0.32,0,0.736,0,1.152	
                          c0,51.008,36.384,93.376,84.096,103.136c-8.544,2.336-17.856,3.456-27.52,3.456c-6.72,0-13.504-0.384-19.872-1.792 c13.6,41.568,52.192,72.128,98.08,73.12c-35.712,27.936-81.056,44.768-130.144,44.768c-8.608,0-16.864-0.384-25.12-1.44 C46.496,446.88,101.6,464,161.024,464c193.152,0,298.752-160,298.752-298.688c0-4.64-0.16-9.12-0.384-13.568 C480.224,136.96,497.728,118.496,512,97.248z"
                          />
                        </svg>
                        <div id="twitter-link" className="display-none">Twitter Link</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="desc">
                <p>
                  I’m a full-stack web developer always looking for an opportunity
                  to solve problems, learn, and grow in a positive environment
                  with motivated, supportive people.
                </p>
                <p>
                  Scroll down to check out some of my work!
                </p>
              </div>
            </div>
          </div>
          <div className="stack-wrap">
            <div className="frameworks-wrap">
              <div className="fw stack-text">frameworks</div>
              <img className="react logo" src={react} alt="react-logo.png" />
              <img className="vue logo" src={vue} alt="vue-logo.png" />
            </div>
            <div className="libraries-wrap">
              <div className="lib stack-text">libraries</div>
              <img className="bootstrap logo" src={bootstrap} alt="bs-logo.png" />
              <img className="rbs logo" src={rbs} alt="rbs-logo.png" />
              <img className="sass logo" src={sass} alt="sass-logo.png" />
            </div>
            <div className="fundamentals-wrap">
              <div className="funds stack-text">fundamentals</div>
              <img className="html logo" src={html} alt="html-logo.png" />
              <img className="css logo" src={css} alt="css-logo.png" />
              <img className="js logo" src={js} alt="js-logo.png" />
              <img className="csharp logo" src={cSharp} alt="cSharp-logo.png" />
            </div>
            <div className="backend">
              <div className="be stack-text">backend</div>
              <img className="sql logo" src={sql} alt="sql-logo.png" />
              <img className="nodejs logo" src={nodejs} alt="nodejs-logo.png" />
            </div>
            <div className="version-control">
              <div className="vc stack-text">version control</div>
              <img className="github logo" src={github} alt="github-logo.png" />
              <img className="git logo" src={git} alt="git" />
            </div>
          </div>
        </div>
        <div className="projects-page">
        <div className="proj-wrap">
          <h2>Projects</h2>
        </div>
        <div className="projects-wrap">
          <div className="showcase-wrap">
            <div className="showcase">
              <a href="https://www.andyfancherpresents.com/" target="_blank" rel="noopener noreferrer" alt="AFP-Showcase">
                <img className="proj-img" src={afp} alt="afp-showcase.png" />
              </a>
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
                  <svg
                    className="media-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    aria-labelledby="github-link"
                  >
                    <path
                      d="M255.968,5.329C114.624,5.329,0,120.401,0,262.353c0,113.536,73.344,209.856,175.104,243.872
                      c12.8,2.368,17.472-5.568,17.472-12.384c0-6.112-0.224-22.272-0.352-43.712c-71.2,15.52-86.24-34.464-86.24-34.464 
                      c-11.616-29.696-28.416-37.6-28.416-37.6c-23.264-15.936,1.728-15.616,1.728-15.616c25.696,1.824,39.2,26.496,39.2,26.496 
                      c22.848,39.264,59.936,27.936,74.528,21.344c2.304-16.608,8.928-27.936,16.256-34.368 
                      c-56.832-6.496-116.608-28.544-116.608-127.008c0-28.064,9.984-51.008,26.368-68.992c-2.656-6.496-11.424-32.64,2.496-68 
                      c0,0,21.504-6.912,70.4,26.336c20.416-5.696,42.304-8.544,64.096-8.64c21.728,0.128,43.648,2.944,64.096,8.672 c48.864-33.248,70.336-26.336,70.336-26.336c13.952,35.392,5.184,61.504,2.56,68c16.416,17.984,26.304,40.928,26.304,68.992 c0,98.72-59.84,120.448-116.864,126.816c9.184,7.936,17.376,23.616,17.376,47.584c0,34.368-0.32,62.08-0.32,70.496 c0,6.88,4.608,14.88,17.6,12.352C438.72,472.145,512,375.857,512,262.353C512,120.401,397.376,5.329,255.968,5.329z"
                    />
                  </svg>
                  <div id="github-link" className="display-none">Github Link</div>
                </a>
              </div>
              <p className="desc">
                When he was 9 years old, Andy Fancher, found WWII memorabilia that
                inspired him to know more, but little to no information was known
                about the veterans he found. It later inspired him to go on a 
                mission to find the untold stories of these heroes so the world 
                could better know them in what became Andy Fancher Presents. On 
                this platform, he could document these stories for the world to
                see and hear for themselves.
              </p>
              <p className="desc">
                His journey inspired me, knowing that so many amazing stories have
                been lost over time, so I used how I could help to design this
                website for him in hopes it could help his journey be successful.
              </p>
            </div>
          </div>
          <div className="showcase-wrap">
            <div className="showcase">
              <a href="http://drino.live/" target="_blank" rel="noopener noreferrer" alt="Drino-Showcase">
                <img className="proj-img" src={drino} alt="drino-showcase.png" />
              </a>
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
                  <svg
                    className="media-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    aria-labelledby="github-link"
                  >
                    <path
                      d="M255.968,5.329C114.624,5.329,0,120.401,0,262.353c0,113.536,73.344,209.856,175.104,243.872
                      c12.8,2.368,17.472-5.568,17.472-12.384c0-6.112-0.224-22.272-0.352-43.712c-71.2,15.52-86.24-34.464-86.24-34.464 c-11.616-29.696-28.416-37.6-28.416-37.6c-23.264-15.936,1.728-15.616,1.728-15.616c25.696,1.824,39.2,26.496,39.2,26.496 c22.848,39.264,59.936,27.936,74.528,21.344c2.304-16.608,8.928-27.936,16.256-34.368 c-56.832-6.496-116.608-28.544-116.608-127.008c0-28.064,9.984-51.008,26.368-68.992c-2.656-6.496-11.424-32.64,2.496-68 c0,0,21.504-6.912,70.4,26.336c20.416-5.696,42.304-8.544,64.096-8.64c21.728,0.128,43.648,2.944,64.096,8.672 c48.864-33.248,70.336-26.336,70.336-26.336c13.952,35.392,5.184,61.504,2.56,68c16.416,17.984,26.304,40.928,26.304,68.992 c0,98.72-59.84,120.448-116.864,126.816c9.184,7.936,17.376,23.616,17.376,47.584c0,34.368-0.32,62.08-0.32,70.496 c0,6.88,4.608,14.88,17.6,12.352C438.72,472.145,512,375.857,512,262.353C512,120.401,397.376,5.329,255.968,5.329z"
                    />
                  </svg>
                  <div id="github-link" className="display-none">Github Link</div>
                </a>
              </div>
              <p className="desc">
                This is a full-stack project I built for both sides of a
                buisiness; customer/employee relations. It is a fully RESTful design that includes:
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
        </div>
      </div>
      </div>
    );
  }
}

export default Info
