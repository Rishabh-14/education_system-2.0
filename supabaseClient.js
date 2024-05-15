// File: supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);


const { data, error } = await supabase
  .from('students')
  .insert([
    { 
      id: '550e8400-e29b-41d4-a716-446655440000', // Replace with a valid UUID
      name: 'John Doe', 
      age: 20, 
      learningstyle: 'Visual', 
      interests: ['math', 'science'], 
      createdat: new Date().toISOString() 
    }
  ])
  .select()

if (error) {
  console.error('Error inserting data:', error)
} else {
  console.log('Data inserted successfully:', data)
}

export default supabase;
