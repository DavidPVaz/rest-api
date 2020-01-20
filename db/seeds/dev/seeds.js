/** 
 * @file Knex seeds
 * 
 * {@link http://knexjs.org/}
 */
exports.seed = async function(knex) {
    await knex('users').del();
    return knex('users').insert([
        {
            id: 1,
            username: 'david',
            password: '$2b$10$XU.gFy6ZHLb8.r4WvTxMdO8eq4uVq.0dGmJCXfzcJ9bZ1E0AF8phO', 
            email: 'dummy_email@gmail.com',
            admin: true
        },
        {
            id: 2,
            username: 'nunovaz',
            password: '$2b$10$XU.gFy6ZHLb8.r4WvTxMdO8eq4uVq.0dGmJCXfzcJ9bZ1E0AF8phO', 
            email: 'another_dummy@gmail.com'
        }
    ]);
};
