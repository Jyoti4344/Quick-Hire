import React from 'react';
import './Team.css';
import My_profile from '../assets/My_profile.jpg'
import subho_pic from '../assets/subho_pic.jpg'

export default function Team() {
  const teamMembers = [
    {
      name: "Ankit Nair",
      role: "Design and Dev",
      image: "/placeholder.svg?height=200&width=200"
    },
    {
      name: "Anil Panth",
      role: "Frontend and Dev",
      image: My_profile
    },
    {
      name: "Subhojit Mukhopadhyay",
      role: "Github and DevOps",
      image: subho_pic
    },
    {
      name: "Utkarsh Sharma",
      role: "Backend and Dev",
      image: "/placeholder.svg?height=200&width=200"
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