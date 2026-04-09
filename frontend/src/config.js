import config from '../../config.json';

// Provide a central API URL that derives from the root config.json
export const API_URL = `http://${config.HOST_IP}:5000`;
