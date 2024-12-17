import express from 'express';
import { query } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT ee."idEmpEquip", e."nameEmployee", e."officeEmployee", 
             te."typeName" AS "typeName", eq."nameEquip"
      FROM "empEquip" ee
      JOIN "employee" e ON ee."idEmployee" = e."idEmployee"
      JOIN "equip" eq ON ee."idEquip" = eq."idEquip"
      JOIN "typeEquip" te ON eq."idTypeEquip" = te."idTypeEquip"
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении данных из empEquip' });
  }
});


router.get('/:name', async (req, res) => {
  const { name } = req.params;  
  try {
    const result = await query(`
      SELECT ee."idEmpEquip", e."nameEmployee", e."officeEmployee", 
             te."typeName" AS "typeName", eq."nameEquip"
      FROM "empEquip" ee
      JOIN "employee" e ON ee."idEmployee" = e."idEmployee"
      JOIN "equip" eq ON ee."idEquip" = eq."idEquip"
      JOIN "typeEquip" te ON eq."idTypeEquip" = te."idTypeEquip"
      WHERE e."nameEmployee" ILIKE $1
    `, [`%${name}%`]); 

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Записи не найдены' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении данных из empEquip' });
  }
});

router.post('/', async (req, res) => {
  const { nameEmployee, nameEquip } = req.body; 

  try {
    const employeeResult = await query(
      'SELECT "idEmployee" FROM "employee" WHERE "nameEmployee" = $1',
      [nameEmployee]
    );

    if (employeeResult.rows.length === 0) {
      return res.status(400).json({ error: 'Неверное имя сотрудника. Сотрудник не найден.' });
    }

    const idEmployee = employeeResult.rows[0].idEmployee; 

    const equipResult = await query(
      'SELECT "idEquip" FROM "equip" WHERE "nameEquip" = $1',
      [nameEquip]
    );

    if (equipResult.rows.length === 0) {
      return res.status(400).json({ error: 'Неверное имя оборудования. Оборудование не найдено.' });
    }

    const idEquip = equipResult.rows[0].idEquip; 

    const result = await query(
      'INSERT INTO "empEquip" ("idEmployee", "idEquip") VALUES ($1, $2) RETURNING *',
      [idEmployee, idEquip]
    );

    res.status(201).json(result.rows[0]);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при добавлении записи в empEquip' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nameEmployee, nameEquip } = req.body;  

  try {
    const employeeResult = await query(
      'SELECT "idEmployee" FROM "employee" WHERE "nameEmployee" = $1',
      [nameEmployee]
    );

    if (employeeResult.rows.length === 0) {
      return res.status(400).json({ error: 'Неверное имя сотрудника. Сотрудник не найден.' });
    }

    const idEmployee = employeeResult.rows[0].idEmployee;  

    const equipResult = await query(
      'SELECT "idEquip" FROM "equip" WHERE "nameEquip" = $1',
      [nameEquip]
    );

    if (equipResult.rows.length === 0) {
      return res.status(400).json({ error: 'Неверное имя оборудования. Оборудование не найдено.' });
    }

    const idEquip = equipResult.rows[0].idEquip;  

    const result = await query(
      'UPDATE "empEquip" SET "idEmployee" = $1, "idEquip" = $2 WHERE "idEmpEquip" = $3 RETURNING *',
      [idEmployee, idEquip, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    res.status(200).json(result.rows[0]);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при обновлении записи в empEquip' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      'DELETE FROM "empEquip" WHERE "idEmpEquip" = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    res.status(200).json({ message: 'Запись успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при удалении записи из empEquip' });
  }
});

export default router;
