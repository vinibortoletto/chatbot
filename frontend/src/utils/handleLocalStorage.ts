const set = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value))
}

const get = (key: string): unknown => {
  const value = localStorage.getItem(key)
  if (!value) return null
  return JSON.parse(value)
}

const handleLocalStorage = {
  set,
  get
}

export default handleLocalStorage
