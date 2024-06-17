import SRC from '../Models/SRC';
import School from '../Models/School';

const getSRC = async (email: string) => {
  let src = await SRC.findOne({ email }).catch((err: Error) => {
    return err.message;
  });
  if (!src) {
    return { message: 'src not found' };
  }
  return { message: 'success', src };
};

const getSchool = async (email: string) => {
  let src = await SRC.findOne({ email }).catch((err: Error) => {
    return { message: err.message };
  });
  if (!src) {
    return { message: 'src not found' };
  }
  const school = await School.findOne({ SRC: src }).catch((err: Error) => {
    return { message: err.message };
  });
  if (!school) {
    return { message: 'school not found' };
  }
  return { message: 'success', school };
};

export { getSRC, getSchool };
