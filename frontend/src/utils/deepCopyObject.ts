const deepCopyObject = <T>(object: T): T => {
  return JSON.parse(JSON.stringify(object))
}

export default deepCopyObject
