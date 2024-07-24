// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { mainStore } from '../GlobalStore';

// const useSessionExpired = () => {
//   const { getUserType } = mainStore();
//   const navigate = useNavigate();

//   const handleSessionExpired = async () => {
//     if (localStorage.getItem('token')) {
//       // localStorage.clear();
//       // navigate('/login');
//       // console.log('it was me');
//       // alert('session expired');
//     }
//   };

//   useEffect(() => {
//     const controller = new AbortController();

//     const checkSessionExpired = async () => {
//       try {
//         const response = await fetch(
//           'http://localhost:3000/authenticateToken',
//           {
//             method: 'POST',
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//               'Content-Type': 'application/json',
//             },
//             signal: controller.signal,
//           }
//         );

//         if (!response.ok) {
//           handleSessionExpired();
//         }
//       } catch (err) {}
//     };

//     if (getUserType() == 'student') {
//       console.log(getUserType());
//       checkSessionExpired();
//     }

//     return () => {
//       controller.abort();
//     };
//   }, []);

//   return { handleSessionExpired };
// };

// export default useSessionExpired;
