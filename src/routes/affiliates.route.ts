import express from 'express';
const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({ message: 'List of affiliates' });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: `Details of affiliate with ID: ${id}` });
});

export default router;