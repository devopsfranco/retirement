import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

// Load environment variables for database configuration
const DB_HOST = process.env.NEXT_PUBLIC_DB_HOST || 'retirementcoin.io';
const DB_USER = process.env.NEXT_PUBLIC_DB_USER || 'retimtrc_1';
const DB_PASSWORD = process.env.NEXT_PUBLIC_DB_PASSWORD || '12345aaaaa@aaaabbBbb!!';
const DB_NAME = process.env.NEXT_PUBLIC_DB_NAME || 'retimtrc_data';
const API_KEY = process.env.NEXT_PUBLIC_DB_API || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-KEY');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  // Allow only GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  // Validate API key
  const headers = req.headers;
  const apiKey = headers['x-api-key'];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid API Key' });
  }

  let connection;

  try {
    // Establish a database connection
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    // Query to fetch topics, options, and vote counts
    const query = `
      SELECT 
        t.id AS topic_id, 
        t.title AS topic_title, 
        t.created_at AS topic_created_at, 
        o.id AS option_id, 
        o.option_text AS option_title, 
        COALESCE(SUM(v.vote_value), 0) AS total_votes
      FROM topics t
      LEFT JOIN options o ON t.id = o.topic_id
      LEFT JOIN votes v ON o.id = v.option_id
      WHERE t.status = 'active'
      GROUP BY t.id, o.id
      ORDER BY t.created_at DESC, o.id ASC;
    `;

    const [rows] = await connection.execute(query);

    // Process the results into a structured format
    const topics: Record<number, any> = {};
    for (const row of rows as any[]) {
      const topicId = row.topic_id;

      if (!topics[topicId]) {
        topics[topicId] = {
          topic_id: row.topic_id,
          title: row.topic_title,
          created_at: row.topic_created_at,
          options: [],
        };
      }

      if (row.option_id !== null) {
        topics[topicId].options.push({
          option_id: row.option_id,
          option_title: row.option_title,
          total_votes: row.total_votes,
        });
      }
    }

    // Return the structured data
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ status: 'success', topics: Object.values(topics) });
  } catch (error: any) {
    console.error('Error fetching topics:', error.message);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
