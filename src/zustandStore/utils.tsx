export const getProjectNameFromFile = (file: File): string | null => {
  const fileName = file.name;
  const match = fileName.match(/(.*)\.json$/);
  
  return match ? match[1] : null;
};