class AgendaService {
    constructor(agendaRepository) {
        this.agendaRepository = agendaRepository;
    }

    async findAll(filters = {}) {
        return await this.agendaRepository.findAll(filters);
    }

    async findById(id) {
        const agenda = await this.agendaRepository.findById(id);
        if (!agenda) {
            throw new Error('Agenda no encontrada');
        }
        return agenda;
    }

    async create(payload) {
        // Validaciones de negocio
        this.validateAgendaPayload(payload);

        // Verificar que el prestador existe y tiene la especialidad
        if (!payload.cuitCuil) {
            throw new Error('El CUIT/CUIL del prestador es requerido');
        }

        if (!payload.idEspecialidad) {
            throw new Error('La especialidad es requerida');
        }

        if (!payload.idLugar) {
            throw new Error('El lugar de atención es requerido');
        }

        if (!payload.duracionTurno || payload.duracionTurno < 15) {
            throw new Error('La duración del turno debe ser al menos 15 minutos');
        }

        if (!payload.bloques || payload.bloques.length === 0) {
            throw new Error('Debe definir al menos un bloque horario');
        }

        // Validar bloques horarios
        for (const bloque of payload.bloques) {
            if (!bloque.dias || bloque.dias.length === 0) {
                throw new Error('Cada bloque debe tener al menos un día seleccionado');
            }
            if (!bloque.desde || !bloque.hasta) {
                throw new Error('Cada bloque debe tener horario de inicio y fin');
            }
            if (bloque.desde >= bloque.hasta) {
                throw new Error('La hora de inicio debe ser anterior a la hora de fin');
            }
        }

        return await this.agendaRepository.create(payload);
    }

    async update(id, payload) {
        // Validar que existe
        await this.findById(id);

        // Validaciones básicas
        if (payload.duracionTurno && payload.duracionTurno < 15) {
            throw new Error('La duración del turno debe ser al menos 15 minutos');
        }

        if (payload.bloques) {
            if (!Array.isArray(payload.bloques) || payload.bloques.length === 0) {
                throw new Error('Debe definir al menos un bloque horario');
            }

            for (const bloque of payload.bloques) {
                if (!bloque.dias || bloque.dias.length === 0) {
                    throw new Error('Cada bloque debe tener al menos un día seleccionado');
                }
                if (!bloque.desde || !bloque.hasta) {
                    throw new Error('Cada bloque debe tener horario de inicio y fin');
                }
                if (bloque.desde >= bloque.hasta) {
                    throw new Error('La hora de inicio debe ser anterior a la hora de fin');
                }
            }
        }

        return await this.agendaRepository.update(id, payload);
    }

    async delete(id) {
        // Validar que existe
        await this.findById(id);
        return await this.agendaRepository.delete(id);
    }

    validateAgendaPayload(payload) {
        const required = ['cuitCuil', 'idEspecialidad', 'idLugar', 'duracionTurno', 'bloques'];
        for (const field of required) {
            if (!payload[field]) {
                throw new Error(`El campo ${field} es requerido`);
            }
        }
    }
}

module.exports = AgendaService;