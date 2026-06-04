const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const supabase = createClient (
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

app.post('/save', async(req, res) => {
    const { text } = req.body;

    const { data, error } = await supabase.from('texts').insert([{ text }]);

    if (error) return res.status(500).json(error);

    res.json({message: 'Saved', data});
});

app.get('/texts', async(req, res) => {
    const { data, error } = await supabase.from('texts').select('*').order('created_at', { ascending: false });

    if (error) return res.status(500).json(error);

    res.json(data);
});

app.delete('/texts', async(req, res) => {
    const { data, error } = await supabase
        .from('texts')
        .delete()
        .neq('id', 0);  
    
    if (error) return res.status(500).json(error);
    
    res.json({ message: 'All texts deleted successfully' });
});

app.delete('/texts/:id', async (req, res) => {
    const { id } = req.params;
    
    const { data, error } = await supabase
        .from('texts')
        .delete()
        .eq('id', id);
    
    if (error) return res.status(500).json(error);
    
    res.json({ message: 'Deleted successfully' });
});





app.listen(5000, () => {
    console.log('The server is running at port 5000');
});