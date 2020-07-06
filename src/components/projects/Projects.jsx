import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Projects.scss";

import afp from "../../images/AFPShowcase.jpg";
import drino from "../../images/DrinoShowcase.jpg";

function Projects() {
  return (
    <div className="projects-page">
      <div className="projects-wrap">
        <Link to="/info" className="back">
          <svg
            className="arrow"
            viewBox="0 0 75 75"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m32 56c1.104 0 2-.896 2-2v-39.899l14.552 15.278c.393.413.92.621 1.448.621.495 
                    0 .992-.183 1.379-.552.8-.762.831-2.028.069-2.828l-16.619-17.448c-.756-.755-1.76-1.172-2.829-1.172s-2.073.417-2.862 
                    1.207l-16.586 17.414c-.762.8-.731 2.066.069 2.828s2.067.731 2.828-.069l14.551-15.342v39.962c0 1.104.896 2 2 2z"
            />
          </svg>
        </Link>
        <div className="showcase-wrap">
          <div className="showcase">
            <a href="https://www.andyfancherpresents.com/" target="_blank" rel="noopener noreferrer" alt="AFP-Showcase">
              <img className="proj-img" src={afp} alt="afp-showcase.png" />
            </a>
          </div>
          <div className="text">
            <h1>Andy Fancher Presents</h1>
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
            <h1>Drino</h1>
            <p className="desc">
              This was a full-stack project I worked on for both sides of a
              buisiness. It is a fully RESTful design that includes data
              statistic capabilities, a customizable profile for employees, a
              fully working contact form along with a inbox for messages, and a
              editable list of employees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
