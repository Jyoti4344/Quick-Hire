import React from "react";
import "./Team.css";
import My_profile from "../assets/My_profile.jpg";
import jyotu from "../assets/jyotu.png";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Team() {
  const teamMembers = [
    {
      name: "Jyoti Goel",
      role: "ML and Backend",
      image: jyotu,
      github: "https://github.com/Jyoti4344",
      linkedin: "https://www.linkedin.com/in/jyoti-goel-8a91b2269",
    },
    {
      name: "Anil Panth",
      role: "Frontend and Dev",
      image: My_profile,
      github: "https://github.com/Anilpanth-hue",
      linkedin: "http://www.linkedin.com/in/anil-panth-b060a2256",
    },
  ];

  return (
    <section className="team-section">
      <div className="team-container">
        <h2 className="team-title">Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className={`team-member member-${index + 1}`}
            >
              <div className="member-content">
                <div className="image-container">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="member-image"
                  />
                </div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <div className="member-links">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="linkedin-link"
                  >
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </div>
          ))}
          <div className="connection-lines">
            <div className="line line-1"></div>
            <div className="line line-2"></div>
            <div className="line line-3"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
