import express from 'express';
import { query } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM "typeEquip"');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении данных типов техники' });
  }
});

router.get('/:typeName', async (req, res) => {
  const { typeName } = req.params;
  try {
    const result = await query('SELECT * FROM "typeEquip" WHERE "typeName" ILIKE $1', [`%${typeName}%`]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Тип техники не найден' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении данных типа техники' });
  }
});

router.post('/', async (req, res) => {
  const { typeName } = req.body;
  try {
    const result = await query(
      'INSERT INTO "typeEquip" ("typeName") VALUES ($1) RETURNING *',
      [typeName]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при создании типа техники' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { typeName } = req.body;
  try {
    const result = await query(
      'UPDATE "typeEquip" SET "typeName" = $1 WHERE "idTypeEquip" = $2 RETURNING *',
      [typeName, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Тип техники не найден' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при обновлении типа техники' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM "typeEquip" WHERE "idTypeEquip" = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Тип техники не найден' });
    }
    res.status(200).json({ message: 'Тип техники успешно удалён' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при удалении типа техники' });
  }
});

export default router;
