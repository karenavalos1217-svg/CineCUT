const express = require('express');
const router = express.Router();

router.get('/usuarios/health', (_req, res) => {
  res.json({ ok: true });
});

module.exports = router;
