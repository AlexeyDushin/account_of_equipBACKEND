import express from 'express';
import { query } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT DISTINCT "officeEmployee" 
      FROM "employee"
      WHERE "officeEmployee" IS NOT NULL
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Офисы не найдены' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
});

export default router;
