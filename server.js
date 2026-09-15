const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Supabase Connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'YOUGO Backend API is running successfully!' });
});

// Database Connection Check
app.get('/api/db-status', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) throw error;
    res.json({ status: 'Connected', message: 'Database connection active' });
  } catch (err) {
    res.status(500).json({ status: 'Error', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`YOUGO Server running on port ${PORT}`);
});
