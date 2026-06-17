

const BASE_URL = 'http://localhost:3002';

async function runTest() {
  console.log('=== Student API Test ===');

  // Register user
  const email = `test-${Date.now()}@example.com`;
  const registerRes = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email, password: 'test1234', role: 'STUDENT' })
  });
  console.log('Register status', registerRes.status);
  const registerData = await registerRes.json();
  console.log('Register body', registerData);

  // Use session cookie from registration response
  const setCookie = registerRes.headers.get('set-cookie') || '';
  const authHeaders = { 'Content-Type': 'application/json', Cookie: setCookie };

  // Create student profile
  const userId = registerData.user.id;
  const createRes = await fetch(`${BASE_URL}/api/student/create`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      userId,
      rollNumber: '12345',
      department: 'CS',
      collegeName: 'Test College',
      cgpa: 9.5,
      githubUrl: 'https://github.com/test',
      leetcode: 'https://leetcode.com/test',
      portfolio: 'https://portfolio.com',
      linkedin: 'https://linkedin.com/in/test'
    })
  });
  console.log('Create status', createRes.status, await createRes.json());

  // Get profile
  const getRes = await fetch(`${BASE_URL}/api/student/profile`, {
    method: 'GET',
    headers: authHeaders
  });
  console.log('Get status', getRes.status, await getRes.json());

  // Update profile
  const updateRes = await fetch(`${BASE_URL}/api/student/profile`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      rollNumber: '12345',
      department: 'IT',
      collegeName: 'Updated College',
      cgpa: 9.8,
      githubUrl: 'https://github.com/updated',
      leetcode: 'https://leetcode.com/updated',
      portfolio: 'https://portfolio.com/updated',
      linkedin: 'https://linkedin.com/in/updated'
    })
  });
  console.log('Update status', updateRes.status, await updateRes.json());
}

runTest().catch(err => console.error('Test error', err));
