import express from 'express';
import { query } from '../db.js';

const router = express.Router();

router.get('/:office', async (req, res) => {
  const { office } = req.params;  
  try {
    const result = await query(`
      SELECT e."idEmployee", e."nameEmployee", e."officeEmployee", 
             te."typeName" AS "typeName", eq."nameEquip", eq."idEquip"
      FROM "empEquip" ee
      JOIN "employee" e ON ee."idEmployee" = e."idEmployee"
      JOIN "equip" eq ON ee."idEquip" = eq."idEquip"
      JOIN "typeEquip" te ON eq."idTypeEquip" = te."idTypeEquip"
      WHERE e."officeEmployee" ILIKE $1
    `, [`%${office}%`]); 

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Сотрудники в указанном офисе не найдены и/или у них нет техники' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
});

export default router;
