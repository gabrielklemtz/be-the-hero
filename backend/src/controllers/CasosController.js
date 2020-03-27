const connection = require('../database/connection');

module.exports={
    async index(request, response){
        const { pag = 1} = request.query;

        const [count] = await connection('casos').count();


        const ongs = await connection('casos')
        .join('ongs', 'ongs.id', '=', 'casos.ong_id')
        .limit(5)
        .offset((pag -1 )* 5)
        .select('casos.*',
        'ongs.nome',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf');
        
        response.header('X-TOTAL-COUNT', count['count(*)'])

        return response.json(ongs);
    
    },
    async create(request, response){
        const{ title, description, value} = request.body;
        const ong_id = request.headers.authorization;

       const [id] = await connection('casos').insert({
        title, description, value, ong_id,
        })
        return response.json({ id });
    },

    async delete(request, response){
        
        const { id } = request.params;
        const ong_id =  request.headers.authorization;

        const caso = await connection('casos').where('id', id).select('ong_id');

        if (caso.ong_id != ong_id) {
            return response.status(401).json({ error: 'Operação não autorizada'
            });
        }
        await connection('casos').where('id', id).delete();
        return response.status(204).sed();
    }
}