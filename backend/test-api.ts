async function runTest() {
  console.log("=== Testing Backend Server & Better Auth ===");
  
  try {
    // 1. Health check
    console.log("\n1. Testing health check endpoint...");
    const healthRes = await fetch("http://localhost:3001/api/health");
    console.log("Status:", healthRes.status);
    console.log("Body:", await healthRes.json());
    
    // 2. Better Auth base session endpoint
    console.log("\n2. Testing Better Auth session endpoint...");
    const sessionRes = await fetch("http://localhost:3001/api/auth/get-session");
    console.log("Status:", sessionRes.status);
    const sessionText = await sessionRes.text();
    console.log("Body:", sessionText || "(empty response)");

    // 3. Register a test user via custom route
    console.log("\n3. Testing custom registration endpoint...");
    const registerRes = await fetch("http://localhost:3001/api/custom-auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        password: "testpassword123",
        role: "user"
      })
    });
    console.log("Status:", registerRes.status);
    console.log("Body:", await registerRes.json());

    console.log("\n=== Test complete ===");
  } catch (error) {
    console.error("Test failed with error:", error);
  }
}

runTest();
