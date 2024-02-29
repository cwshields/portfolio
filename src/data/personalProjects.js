import bloglab from "../images/BlogLabShowcase.jpg";
import drino from "../images/DrinoShowcase.jpg";
import afp from "../images/AFPShowcase.jpg";

const personalExpData = [
  {
    link: {
      url: "https://bloglab.live/",
      img: bloglab,
      alt: "BlogLab Showcase",
    },
    name: "BlogLab",
    description: [
      "BlogLab is a website that will be designed to allow users to post and share blogs, listings, podcasts, and more. It's my current personal project I'm developing to learn cutting edge web development techniques.",
    ],
    github: {
      url: "https://github.com/cwshields/bloglab-web",
    },
    subheader: ["Current features:", "Coming soon:"],
    features: [
      [
        "Data driven home page",
        "Advanced routing",
        "Custom Logo Design",
        "Axios Hooks API",
        "AWS Lambda",
        "Post sorting",
      ],
      [
        "Strapi Backend",
        "Blog posting/editing",
        "Login functionality",
        "Brand Shop",
        "Contact form",
        "Tag constructors",
      ],
    ],
  },
  {
    link: {
      url: "",
      img: drino,
      alt: "Drino Showcase",
    },
    name: "Drino",
    description: [
      "This is a full-stack project I built for both sides of a buisiness; customer/employee relations. It is a fully RESTful design that includes:",
    ],
    github: {
      url: "https://github.com/cwshields/drino-app",
    },
    subheader: [""],
    features: [
      [
        "Landing page",
        "Login functionality",
        "Data statistics",
        "Customizable employee profile",
        "Contact form",
        "Administrator inbox",
        "Employee information list",
        "Template pages",
      ],
    ],
  },
  {
    link: {
      url: "",
      img: afp,
      alt: "AFP Showcase",
    },
    name: "Andy Fancher Presents",
    description: [
      "When he was 9 years old, Andy Fancher, found WWII memorabilia that inspired him to know more, but little to no information was known about the veterans he found. It later inspired him to go on a mission to find the untold stories of these heroes so the world could better know them in what became Andy Fancher Presents. On this platform, he could document these stories for the world to see and hear for themselves.",
      "This was the first website I built professionally, and now it is a set piece to humble beginnings meanwhile being an excellent foundation for my advancement as a software developer.",
    ],
    github: {
      url: "https://github.com/cwshields/AFP",
    },
    subheader: [""],
    features: [[]],
  },
];

export default personalExpData;
