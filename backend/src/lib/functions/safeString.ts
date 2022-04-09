// safeString is a function that replace unsafe user input and replaced to to _
const safeString = (str: string): string => {
  let result = '';
  try {
    // ReqEXP to match letters and Numbers only
    result = str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  } catch (e) {
    return '';
  }

  return result;
};

export default safeString;
