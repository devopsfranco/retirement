import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

// Load environment variables for database configuration
const DB_HOST = process.env.NEXT_PUBLIC_DB_HOST || 'retirementcoin.io';
const DB_USER = process.env.NEXT_PUBLIC_DB_USER || 'retimtrc_1';
const DB_PASSWORD = process.env.NEXT_PUBLIC_DB_PASSWORD || '12345aaaaa@aaaabbBbb!!';
const DB_NAME = process.env.NEXT_PUBLIC_DB_NAME || 'retimtrc_data';
const API_KEY = process.env.NEXT_PUBLIC_DB_API || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const headers = req.headers;
  const apiKey = headers['x-api-key'];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid API Key' });
  }

  const { topic_title, options } = req.body;

  // Validate input
  if (!topic_title || typeof topic_title !== 'string' || topic_title.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'Invalid or missing topic_title' });
  }

  if (!Array.isArray(options) || options.length === 0 || options.some(opt => typeof opt !== 'string' || opt.trim() === '')) {
    return res.status(400).json({ status: 'error', message: 'Invalid or missing options' });
  }

  // Add "Invalidate" option as per the PHP logic
  options.push('Invalidate');

  let connection;

  try {
    // Establish a database connection
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    // Insert the topic into the topics table
    const [topicResult] = await connection.execute(
      'INSERT INTO topics (title, status, created_at) VALUES (?, "active", NOW())',
      [topic_title]
    );

    const topicId = (topicResult as any).insertId;

    // Insert each option into the options table
    const optionPromises = options.map(option =>
      connection.execute('INSERT INTO options (topic_id, option_text) VALUES (?, ?)', [topicId, option])
    );

    await Promise.all(optionPromises);

    // Return success response
    res.status(200).json({
      status: 'success',
      message: 'Vote proposed successfully',
      topic_id: topicId,
    });
  } catch (error: any) {
    console.error('Error proposing vote:', error.message);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
