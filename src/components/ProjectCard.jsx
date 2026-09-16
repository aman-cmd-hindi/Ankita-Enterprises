import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ image, title, category }) => {
  return (
    <div className="project-card">
      <img src={image} alt={title} className="project-image" />
      <div className="project-overlay">
        <div className="project-info">
          <h3 className="project-title">{title}</h3>
          <p className="project-category">{category}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
