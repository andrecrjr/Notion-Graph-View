export const saveStorage = {
  set: (key: string, data: object) => {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  },
  get: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
};
