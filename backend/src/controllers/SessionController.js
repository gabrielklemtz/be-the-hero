const connection = require('../database/connection');

module.exports={
    async create(request, response){
        const {id} = request.body;

        const ong = await connection('ongs').where('id', id).select('nome');

        if (!ong) {
            return response.status(400).json({ erro: 'no ong found with id'})
        }

        return response.json(ong);
    }

}