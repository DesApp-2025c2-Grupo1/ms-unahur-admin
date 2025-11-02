const Email = require('../entities/Email');
const { Plan } = require('../entities/main')

class EmailMapper {
    map(data) {
        if (!data) return null;
        return new Email(
            {
                idEmail: data.id,
                email: data.email
            }
        )
    }
    mapList(data) {
        if (!Array.isArray(data)) return [];
        return data.map(x => this.map(x));
    }
}

module.exports = EmailMapper;
