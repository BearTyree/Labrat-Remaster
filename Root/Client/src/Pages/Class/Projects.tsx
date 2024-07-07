import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Projects() {
  const params = useParams();
  const [projects, setProjects] = useState([]);

  const getProjects = async () => {
    const response = await fetch('http://localhost:3000/getProjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ id: params.classId }),
    });

    const data = await response.json();
    setProjects(data.projects);
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <>
      {projects.map((project) => {
        <p>{project}</p>;
      })}
    </>
  );
}

export default Projects;
