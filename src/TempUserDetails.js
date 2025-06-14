const persistedData = localStorage.getItem("persist:root");
let authData = null; // Initialize authData

if (persistedData) {
  // Parse the persisted data
  const parsedData = JSON.parse(persistedData);

  // Access the auth data
  authData = parsedData.auth ? JSON.parse(parsedData.auth) : null;
}

export { authData }; // Exporting authData
