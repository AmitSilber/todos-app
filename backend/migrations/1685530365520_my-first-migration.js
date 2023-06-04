/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('todosTableDogs', {
        id: {
            type: 'varchar(255)',
            notNull: true,
            unqiue: true,
            primaryKey: true,
        },
        title: {
            type: 'varchar(255)',
            notNull: true
        },
        date: {
            type: 'varchar(255)',
            notNull: true
        },
        status: {
            type: 'varchar(255)',
            notNull: true
        },
        todosorder: {
            type: 'integer',
            notNull: true
        }
    })
    pgm.addConstraint('todosTableDogs', 'status_is_either_pending_or_completed', {
        check: "status='pending' OR status='completed'"
    })
};

exports.down = pgm => {
    pgm.dropConstraint('todosTableDogs', 'status_is_either_pending_or_completed');
    pgm.dropTable('todosTableDogs');
};
