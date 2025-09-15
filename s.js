const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Halaman utama
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fake iPhone Chat Generator</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; background:#f0f4f8; display:flex; justify-content:center; padding:40px 0; margin:0; }
      .container { width:90%; max-width:800px; background:white; padding:30px; border-radius:15px; box-shadow:0 10px 25px rgba(0,0,0,0.1);}
      h1 { text-align:center; margin-bottom:20px; }
      .form-group { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; }
      .form-group input { flex:1 1 150px; padding:10px; border-radius:8px; border:1px solid #ccc;}
      .form-group button { padding:10px 15px; border:none; border-radius:8px; background:#007bff; color:white; cursor:pointer; }
      .form-group button:hover { background:#0056b3; }
      h2 { margin-top:30px; font-size:1.2rem; color:#333; }
      .chat-scroll { display:flex; gap:15px; overflow-x:auto; padding:10px 0; }
      .chat-card { flex:0 0 auto; width:250px; border-radius:12px; box-shadow:0 3px 10px rgba(0,0,0,0.1); text-align:center; }
      .chat-card img { width:100%; border-radius:12px; }
      .download-btn { margin-top:5px; width:90%; padding:6px; border:none; border-radius:6px; background:#28a745; color:white; cursor:pointer; font-size:0.9rem; transition:0.2s; }
      .download-btn:hover { background:#1e7e34; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Fake iPhone Chat Generator</h1>
      <div class="form-group">
        <input type="text" id="text" placeholder="Chat text" />
        <input type="text" id="chatime" placeholder="Chat time (10.22)" />
        <input type="text" id="statusbartime" placeholder="Status bar time (12.02)" />
        <button id="generateBtn">Generate</button>
      </div>
      <h2>Generated Chats</h2>
      <div id="chatContainer" class="chat-scroll"></div>
    </div>

    <script>
      const textInput = document.getElementById("text");
      const chatimeInput = document.getElementById("chatime");
      const statusInput = document.getElementById("statusbartime");
      const generateBtn = document.getElementById("generateBtn");
      const chatContainer = document.getElementById("chatContainer");

      async function generateChat() {
        const text = textInput.value.trim();
        if(!text) return alert("Please enter chat text");
        const chatime = chatimeInput.value.trim();
        const statusbartime = statusInput.value.trim();
        const query = new URLSearchParams({ text, chatime, statusbartime }).toString();
        const url = '/fakechat?' + query;

        const card = document.createElement("div");
        card.classList.add("chat-card");

        const img = document.createElement("img");
        img.src = url;
        img.alt = text;
        card.appendChild(img);

        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Download";
        downloadBtn.classList.add("download-btn");
        downloadBtn.onclick = () => {
          const a = document.createElement("a");
          a.href = url;
          a.download = text.replace(/\\s+/g,'_') + ".png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
        card.appendChild(downloadBtn);

        chatContainer.prepend(card);
      }

      generateBtn.addEventListener("click", generateChat);
      textInput.addEventListener("keypress", e => { if(e.key==="Enter") generateChat(); });
    </script>
  </body>
  </html>
  `);
});

// Endpoint fetch gambar
app.get("/fakechat", async (req, res) => {
  const { text, chatime, statusbartime } = req.query;
  if (!text) return res.status(400).send("Text required");
  try {
    const params = new URLSearchParams({ text });
    if(chatime) params.append("chatime", chatime);
    if(statusbartime) params.append("statusbartime", statusbartime);
    const url = `https://api.zenzxz.my.id/maker/fakechatiphone?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("API request failed");
    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", response.headers.get("content-type") || "image/png");
    res.send(Buffer.from(buffer));
  } catch(err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
