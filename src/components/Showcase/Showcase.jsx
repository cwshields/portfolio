import React from "react";
import "../../styles/Projects.scss";
import Github from "../../components/SocialMedia/Github";

export default function Showcase(props) {
  console.log("props: ", props.data);
  return (
    <div className="showcase-wrap">
      <div className="showcase">
        {props.data.link.url ? (
          <a
            href={props.data.link.url}
            target="_blank"
            rel="noopener noreferrer"
            alt={props.data.link.alt}
          >
            <img
              className="proj-img"
              src={props.data.link.img}
              alt={props.data.link.alt}
            />
          </a>
        ) : (
          <img className="proj-img" src={props.data.link.img} alt={props.data.link.alt} />
        )}
      </div>
      <div className="text">
        <div className="title-wrap">
          <h1>{props.data.name}</h1>
          {props.data.github.url ? (
            <a
              name="github"
              className="github-link"
              target="_blank"
              rel="noopener noreferrer"
              href={props.data.github.url}
            >
              <Github />
              <div className="display-none">
                Github Link
              </div>
            </a>
          ) : null}
        </div>
        {props.data.description.map((desc, index) => (
          <p className="desc" key={index}>
            {desc}
          </p>
        ))}
        {props.data.features.length > 1 ? (
          <div className="features-wrap">
            <div className="features">
              <p>{props.data.subheader[0]}</p>
              <ul>
                {props.data.features[0].map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="features">
              <p>{props.data.subheader[1]}</p>
              <ul>
                {props.data.features[1].map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <ul>
            {props.data.features[0].map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        )}
      </div>
      {props.data.footer ? (
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
      ) : null}
    </div>
  );
}
