const Telephone = require('../entities/Telephone');

class TelephoneMapper {
    map(data) {
        if (!data) return null;
        return new Telephone(
            {
                idTelefono: data.id,
                telefono: data.telefono
            }
        )
    }
    mapList(data) {
        if (!Array.isArray(data)) return [];
        return data.map(x => this.map(x));
    }
}

module.exports = TelephoneMapper;
