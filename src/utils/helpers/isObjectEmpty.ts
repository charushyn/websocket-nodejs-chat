export default function isObjectEmpty(obj: object) {
  for (const x in obj) {
    return false;
  }
  return true;
}
