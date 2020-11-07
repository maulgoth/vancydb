module.exports = {
    testPool: {
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        connectString: process.env.CONNECTIONSTRING,
        poolMin: 10,
        poolMax: 10,
        poolIncrement: 0,
        poolTimeout: 60
    }
};