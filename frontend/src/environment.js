let IS_PROD = false;

const server = IS_PROD ?
    "https://meetlance-backend.onrender.com" :
    "http://localhost:3000"



export default server;