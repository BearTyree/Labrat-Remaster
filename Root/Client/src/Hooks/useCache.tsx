import { useState, useEffect } from 'react';
import { mainStore, studentStore } from '../GlobalStore.tsx';
import { socket } from '../Socket.tsx';

const useCache = () => {
  // const { userType } = mainStore();
  const { all, setAll } = studentStore();

  let userType = 'Student';
  const getProjects = async () => {
    const response = await fetch('http://localhost:3000/getProjects', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data.projects;
    } else {
      if (data.message == 'jwt expired') {
      }
      return [];
    }
  };

  const findMissing = () => {
    return Object.keys(all()).filter((key) => {
      all()[key] == null;
      return key;
    });
  };
  const cacheMissing = async () => {
    socket.emit('token', localStorage.getItem('token'));
    findMissing().forEach(async (diffKey) => {
      switch (diffKey) {
        case 'projects':
          let projectData = await getProjects();
          console.log(findMissing());
          setAll({ [diffKey]: () => projectData });
      }
    });
  };
  return cacheMissing;
};

export default useCache;
