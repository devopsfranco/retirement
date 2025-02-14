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
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-KEY');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  // Validate API key
  const headers = req.headers;
  const apiKey = headers['x-api-key'];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid API Key' });
  }

  const { wallet, topic_id } = req.body;

  // Validate input
  if (!wallet || typeof wallet !== 'string' || wallet.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'Invalid or missing wallet' });
  }

  if (!topic_id || typeof topic_id !== 'number') {
    return res.status(400).json({ status: 'error', message: 'Invalid or missing topic_id' });
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

    // Check if the vote exists
    const [existingVote] = await connection.execute(
      'SELECT id FROM votes WHERE wallet = ? AND topic_id = ?',
      [wallet, topic_id]
    );

    if ((existingVote as any[]).length === 0) {
      return res.status(404).json({ status: 'error', message: 'No vote found to retract' });
    }

    // Delete the vote
    await connection.execute('DELETE FROM votes WHERE wallet = ? AND topic_id = ?', [wallet, topic_id]);

    return res.status(200).json({ status: 'success', message: 'Vote retracted successfully!' });
  } catch (error: any) {
    console.error('Error retracting vote:', error.message);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
