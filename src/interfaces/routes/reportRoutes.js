const express = require('express');
const ReportController = require('@controllers/ReportController');

const router = express.Router();
const controller = new ReportController();

// Reportes de afiliados
router.get('/reports/altas-afiliados', (req, res) => 
    controller.getAltasAfiliados(req, res)
);

// Reportes de prestadores
router.get('/reports/altas-prestadores', (req, res) => 
    controller.getAltasPrestadores(req, res)
);

router.get('/reports/prestadores-por-especialidad', (req, res) => 
    controller.getPrestadoresPorEspecialidad(req, res)
);

router.get('/reports/prestadores-por-codigo-postal', (req, res) => 
    controller.getPrestadoresPorCodigoPostal(req, res)
);

router.get('/reports/prestadores-sin-agendas', (req, res) => 
    controller.getPrestadoresSinAgendas(req, res)
);

// Reportes de situaciones terapéuticas
router.get('/reports/situaciones-por-afiliado', (req, res) => 
    controller.getSituacionesPorAfiliado(req, res)
);

router.get('/reports/situaciones-por-grupo', (req, res) => 
    controller.getSituacionesPorGrupo(req, res)
);

module.exports = router;