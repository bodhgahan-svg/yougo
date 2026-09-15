const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Supabase Connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Root Check
app.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) throw error;
    res.json({ 
      app: 'YOUGO Backend',
      status: 'Connected', 
      message: 'Database connection active' 
    });
  } catch (err) {
    res.status(500).json({ status: 'Error', error: err.message });
  }
});

// 1. SIGN UP (नया यूजर रजिस्ट्रेशन)
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, role, referrer_id } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Supabase Auth में यूजर बनाएं
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // यूजर प्रोफाइल टेबल में डिटेल्स सेव करें (Default role: viewer)
    const userRole = role || 'viewer'; 
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert([
        { 
          id: data.user.id, 
          email: email, 
          role: userRole, 
          referrer_id: referrer_id || null 
        }
      ])
      .select();

    res.status(201).json({
      message: 'User registered successfully!',
      user: data.user,
      profile: profile ? profile[0] : null
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. LOGIN (लॉगिन करें)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.json({
      message: 'Login successful',
      token: data.session.access_token,
      user: data.user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`YOUGO Server running on port ${PORT}`);
});
