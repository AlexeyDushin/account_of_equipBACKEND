import express from 'express';
import { query } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT e."idEquip", e."nameEquip", te."typeName" AS "typeName"
      FROM "equip" e
      JOIN "typeEquip" te ON e."idTypeEquip" = te."idTypeEquip"
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении данных техники' });
  }
});

router.get('/:nameEquip', async (req, res) => {
  const { nameEquip } = req.params;
  try {
    const result = await query(`
      SELECT e."idEquip", e."nameEquip", te."typeName" AS "typeName"
      FROM "equip" e
      JOIN "typeEquip" te ON e."idTypeEquip" = te."idTypeEquip"
      WHERE e."nameEquip" ILIKE $1
    `, [`%${nameEquip}%`]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Техника не найдена' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении данных техники' });
  }
});

router.post('/', async (req, res) => {
  const { nameEquip, typeName } = req.body;

  try {
    const typeResult = await query(
      'SELECT "idTypeEquip" FROM "typeEquip" WHERE "typeName" = $1',
      [typeName]
    );

    if (typeResult.rows.length === 0) {
      return res.status(400).json({ error: 'Неверное наименование типа техники. Тип не найден.' });
    }

    const idTypeEquip = typeResult.rows[0].idTypeEquip; 

    const result = await query(
      'INSERT INTO equip ("nameEquip", "idTypeEquip") VALUES ($1, $2) RETURNING *',
      [nameEquip, idTypeEquip]
    );

    res.status(201).json(result.rows[0]); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при добавлении техники' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nameEquip, typeName } = req.body; 

  try {
    const typeResult = await query(
      'SELECT "idTypeEquip" FROM "typeEquip" WHERE "typeName" = $1',
      [typeName]
    );

    if (typeResult.rows.length === 0) {
      return res.status(400).json({ error: 'Неверное наименование типа техники. Тип не найден.' });
    }

    const idTypeEquip = typeResult.rows[0].idTypeEquip;  

    const result = await query(
      'UPDATE equip SET "nameEquip" = $1, "idTypeEquip" = $2 WHERE "idEquip" = $3 RETURNING *',
      [nameEquip, idTypeEquip, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Техника не найдена' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при обновлении техники' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      'DELETE FROM equip WHERE "idEquip" = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Техника не найдена' });
    }

    res.status(200).json({ message: 'Техника успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при удалении техники' });
  }
});

export default router;
