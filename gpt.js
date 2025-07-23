
document.addEventListener('DOMContentLoaded', () => {
  const assistantBtn = document.createElement('button');
  assistantBtn.innerText = "Ask the Maestro";
  assistantBtn.id = "gpt-maestro-btn";
  document.body.appendChild(assistantBtn);

  const chatBox = document.createElement('div');
  chatBox.id = "gpt-chat-box";
  chatBox.innerHTML = `
    <div id="gpt-chat-header">The Maestro</div>
    <textarea id="gpt-input" placeholder="Ask about pairings, rituals, cigars..."></textarea>
    <button id="gpt-send">Send</button>
    <div id="gpt-response">Awaiting your wisdom...</div>
  `;
  document.body.appendChild(chatBox);

  assistantBtn.onclick = () => {
    chatBox.classList.toggle('open');
  };

  document.getElementById('gpt-send').onclick = async () => {
    const input = document.getElementById('gpt-input').value;
    document.getElementById('gpt-response').innerText = "The Maestro is thinking...";

    try {
      const res = await fetch("https://theecigarmaestro.vercel.app/api/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: input })
      });

      const data = await res.json();
      document.getElementById('gpt-response').innerText = "🧠 The Maestro says: " + data.response;
    } catch (err) {
      document.getElementById('gpt-response').innerText = "⚠️ Unable to reach The Maestro. Please try again.";
    }
  };
});
