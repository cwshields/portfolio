import cavco from "../images/CavcoHomes.jpg";
import fueland from "../images/FuelandInc.jpg";
import fuelrewards from "../images/FuelRewards.jpg";

// const initialData = [
//   {
//     link: {
//       url: "",
//       img: null,
//       alt: "",
//     },
//     name: "",
//     description: [""],
//     github: {
//       url: "",
//     },
//     subheader: [""],
//     features: [["", ""]],
//   },
// ];

const proExpData = [
  {
    link: {
      url: "https://www.cavcohomes.com/",
      img: cavco,
      alt: "Cavco Industries Showcase",
    },
    name: "Cavco Industries, Inc.",
    description: [
      "Cavco Industries is a leading builder of Manufactured Homes, Modular Homes, Park Model RVs, Commercial Buildings and Vacation Cabins in the United States.",
      "At Cavco Industries, I maintained the parent and sister company websites through Jira tickets involving a wide variety of front-end related problems, that I was able to quickly resolve by utilizing my expertise in, but not excluded to:",
    ],
    github: {
      url: "https://github.com/",
    },
    subheader: [""],
    features: [
      [
        "React/Typescript",
        "Google Maps API",
        "Advanced data handling",
        "CMS management",
        "Chat GPT prompts",
      ],
    ],
  },
  {
    link: {
      url: "",
      img: fueland,
      alt: "Fueland Showcase",
    },
    name: "Fueland, Inc.",
    description: [
      "At Fueland Inc I developed the landing page and signup form for businesses to register their company and stores with the Fueland's Fuel Reward program.",
    ],
    github: {
      url: "https://github.com/",
    },
    subheader: ["It involved a number of technologies such as:"],
    features: [
      [
        "React/Typescript",
        "Login/Registration functionality",
        "Responsive form selections",
        "Password resetting",
        "Signeasy form signing",
        "Java backend",
      ],
    ],
  },
  {
    link: {
      url: "https://join.fuelrewards.com/frconnect/registration.html?partSrcId=merchantrewards",
      img: fuelrewards,
      alt: "Fuel Rewards Showcase",
    },
    name: "Fuel Rewards Connect",
    description: [
      "At PDI Technologies I developed and maintained the front-end Javascript workflow for Fuel Rewards Connect utilizing HTML, CSS, JavaScript, Nunjucks, SASS, JSON, jQuery and Gulp building the login, registration and success pages for sponsors of Shell like Bank of America, Reddit, Sonesta, Red Bull, Dunkin Donuts, CarAdvise, American Airlines, and various others.",
    ],
    github: {
      url: "https://github.com/",
    },
    subheader: ["Features Include:"],
    features: [
      [
        "Registration processes",
        "Login functionality",
        "CMS Utilization",
        "Responsive form selections",
        "Password resetting",
        "Gulp workflows",
      ],
    ],
    footer: true,
  },
];

export default proExpData;
