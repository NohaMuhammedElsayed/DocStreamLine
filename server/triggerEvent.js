import fetch from "node-fetch";

const res = await fetch("http://localhost:5174/api/inngest/event", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Inngest-Event-Key": "test"
  },
  body: JSON.stringify({
    name: "clerk/user.created",
    data: {
      id: "manualTest123",
      first_name: "Test",
      last_name: "User",
      email_addresses: [{ email_address: "t@e.com" }]
    }
  })
});

console.log(await res.text());
