export function validateStudentId(value) {
    // Remove all non-digit characters
    const onlyNumbers = value.replace(/\D/g, "");
  
    // Format based on length
    if (onlyNumbers.length <= 2) {
      return onlyNumbers;
    } else if (onlyNumbers.length <= 4) {
      return `${onlyNumbers.slice(0, 2)}-${onlyNumbers.slice(2)}`;
    } else if (onlyNumbers.length <= 8) {
      return `${onlyNumbers.slice(0, 2)}-${onlyNumbers.slice(2, 4)}-${onlyNumbers.slice(4)}`;
    } else {
      return `${onlyNumbers.slice(0, 2)}-${onlyNumbers.slice(2, 4)}-${onlyNumbers.slice(4, 8)}`;
    }
  }