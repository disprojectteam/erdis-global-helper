const env = process.env.NODE_ENV; // 'dev' or 'prod'

const prod = {
    app: {
        port: process.env.PROD_PORT
    },
    db: {
        host: process.env.PROD_DB_HOST,
        port: process.env.PROD_DB_PORT,
        user: process.env.PROD_DB_USER,
        pass: process.env.PROD_DB_PASS,
        strc: process.env.PROD_DB_STRC
    },
    kafka: {
        url: process.env.PROD_AMQP_URL,
        host: process.env.PROD_AMQP_HOST,
		port: process.env.PROD_AMQP_PORT,
		username: process.env.PROD_AMQP_USER,
		password: process.env.PROD_AMQP_PASS,
        exchange: process.env.PROD_AMQP_EXCHANGE,
        queue: process.env.PROD_AMQP_QUEUE,
        key: process.env.PROD_AMQP_KEY,
    }
};

const dev = {
    app: {
        port: process.env.DEV_PORT
    },
    db: {
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        user: process.env.DEV_DB_USER,
        pass: process.env.DEV_DB_PASS,
        strc: process.env.DEV_DB_STRC
    },
    kafka: {
        url: process.env.DEV_AMQP_URL,
        host: process.env.DEV_AMQP_HOST,
		port: process.env.DEV_AMQP_PORT,
		username: process.env.DEV_AMQP_USER,
		password: process.env.DEV_AMQP_PASS,
        exchange: process.env.DEV_AMQP_EXCHANGE,
        queue: process.env.DEV_AMQP_QUEUE,
        key: process.env.DEV_AMQP_KEY,
    },
    mongodb: {
        url: process.env.MONGO_CONNECTION,
    }
};



const config = {
    prod,
    dev
};

module.exports = config[env];