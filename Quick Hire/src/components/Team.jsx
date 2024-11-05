import React from 'react';
import './Team.css';
import My_profile from '../assets/My_profile.jpg'
import subho_pic from '../assets/subho_pic.jpg'
import ankit from '../assets/ankit.jpg'
import utkarsh from '../assets/utkarsh.jpg'
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Team() {
  const teamMembers = [
    {
      name: "Ankit Nair",
      role: "Design and Dev",
      image: ankit,
      github: "https://github.com/ankitnair01",
      linkedin: "https://linkedin.com/in/ankit-nair01"
    },
    {
      name: "Anil Panth",
      role: "Frontend and Dev",
      image: My_profile,
      github: "https://github.com/Anilpanth-hue",
      linkedin: "http://www.linkedin.com/in/anil-panth-b060a2256"
    },
    {
      name: "Subhojit Mukhopadhyay",
      role: "Github and DevOps",
      image: subho_pic,
      github: "https://github.com/Subho-code",
      linkedin: "https://www.linkedin.com/in/subhojit-mukhopadhyay/"
    },
    {
      name: "Utkarsh Sharma",
      role: "Backend and Dev",
      image: utkarsh,
      github: "https://github.com/utkarsh032003",
      linkedin: "https://www.linkedin.com/in/utkarsh-sharma-a6a620226/"
    }
  ];

  return (
    <section className="team-section">
      <div className="team-container">
        <h2 className="team-title">Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={member.name} className={`team-member member-${index + 1}`}>
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
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="github-link">
                    <FaGithub />
                  </a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-link">
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