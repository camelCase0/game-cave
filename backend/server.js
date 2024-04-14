const WebSocket = require("ws");

// Generate random cave shape data
const generateCaveData = () => {
  const caveData = [];
  for (let i = 0; i < 20; i++) {
    const left = Math.floor(Math.random() * 100) - 100;
    const right = Math.floor(Math.random() * 100) + 1;
    caveData.push([left, right]);
  }
  return caveData;
};

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Send cave shape data to the client
  const sendCaveData = () => {
    const caveData = generateCaveData();
    ws.send(JSON.stringify(caveData));
  };

  // Send cave shape data every second
  const interval = setInterval(() => {
    sendCaveData();
  }, 1000);

  // Stop sending data when client disconnects
  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});
