import express from 'express';
import { query } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM Employee');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении данных сотрудников' });
  }
});

router.get('/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const result = await query('SELECT * FROM Employee WHERE "nameEmployee" ILIKE $1', [`%${name}%`]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении данных сотрудника' });
  }
});

router.post('/', async (req, res) => {
  const { nameEmployee, officeEmployee } = req.body;
  try {
    const result = await query(
      'INSERT INTO Employee ("nameEmployee", "officeEmployee") VALUES ($1, $2) RETURNING *',
      [nameEmployee, officeEmployee]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при создании сотрудника' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nameEmployee, officeEmployee } = req.body;
  try {
    const result = await query(
      'UPDATE Employee SET "nameEmployee" = $1, "officeEmployee" = $2 WHERE "idEmployee" = $3 RETURNING *',
      [nameEmployee, officeEmployee, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при обновлении сотрудника' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM Employee WHERE "idEmployee" = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Сотрудник не найден' });
    }
    res.status(200).json({ message: 'Сотрудник успешно удалён' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при удалении сотрудника' });
  }
});

export default router;
