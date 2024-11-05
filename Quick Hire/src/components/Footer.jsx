import React from "react";
import "../components/Footer.css";

function Footer() {
  // Array containing names and URLs for LinkedIn and GitHub
  const footerData = [
    {
      name: "Utkarsh Sharma",
      linkedIn: "https://www.linkedin.com/in/utkarsh-sharma-a6a620226/",
      github: "https://github.com/utkarsh032003",
    },
    {
      name: "Ankit Nair",
      linkedIn:
        "https://www.linkedin.com/in/ankit-nair01?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github: "https://github.com/ankitnair01",
    },
    {
      name: "Subhojit",
      linkedIn:
        "https://www.linkedin.com/in/subhojit-mukhopadhyay?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github: "https://github.com/Subho-code",
    },
    {
      name: "Anil Panth",
      linkedIn: "http://www.linkedin.com/in/anil-panth-b060a2256",
      github: "https://github.com/Anilpanth-hue",
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        {footerData.map((person, index) => (
          <div key={index} className="footer-column">
            <h3>{person.name}</h3>
            <a href={person.linkedIn} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={person.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
