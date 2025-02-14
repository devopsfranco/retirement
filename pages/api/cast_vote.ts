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

  const { wallet, topic_id, vote_value } = req.body;

  // Validate input
  if (!wallet || typeof wallet !== 'string' || wallet.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'Invalid or missing wallet' });
  }

  if (!topic_id || typeof topic_id !== 'number') {
    return res.status(400).json({ status: 'error', message: 'Invalid or missing topic_id' });
  }

  if (!vote_value || typeof vote_value !== 'number' || vote_value <= 0) {
    return res.status(400).json({ status: 'error', message: 'Invalid or missing vote_value' });
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

    // Check if the wallet has already voted for this topic
    const [existingVote] = await connection.execute(
      'SELECT vote_value FROM votes WHERE wallet = ? AND topic_id = ?',
      [wallet, topic_id]
    );

    if ((existingVote as any[]).length > 0) {
      const currentVoteValue = (existingVote as any[])[0].vote_value;

      if (vote_value > currentVoteValue) {
        // Update the vote if the new vote_value is greater
        await connection.execute(
          'UPDATE votes SET vote_value = ? WHERE wallet = ? AND topic_id = ?',
          [vote_value, wallet, topic_id]
        );

        return res.status(200).json({
          status: 'success',
          message: `Your vote has been updated from ${currentVoteValue} to ${vote_value}!`,
        });
      } else {
        // Warn if the new vote_value is not greater
        return res.status(200).json({
          status: 'warn',
          message: `You have already voted with ${currentVoteValue} power. Your vote remains unchanged.`,
        });
      }
    } else {
      // Insert a new vote if none exists
      await connection.execute(
        'INSERT INTO votes (wallet, topic_id, vote_value) VALUES (?, ?, ?)',
        [wallet, topic_id, vote_value]
      );

      return res.status(200).json({
        status: 'success',
        message: 'Vote submitted successfully!',
      });
    }
  } catch (error: any) {
    console.error('Error processing vote:', error.message);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
