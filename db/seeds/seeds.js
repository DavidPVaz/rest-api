exports.seed = async function(knex) {
    await knex('user').del();
    return knex('user').insert([
        {
            id: 1,
            username: 'davidvaz',
            email: 'dummy_email@gmail.com',
            password: '$2b$10$XU.gFy6ZHLb8.r4WvTxMdO8eq4uVq.0dGmJCXfzcJ9bZ1E0AF8phO', 
            is_admin: true
        },
        {
            id: 2,
            username: 'nunovaz',
            email: 'another_dummy@gmail.com',
            password: '$2b$10$XU.gFy6ZHLb8.r4WvTxMdO8eq4uVq.0dGmJCXfzcJ9bZ1E0AF8phO' 
        }
    ]);
};
