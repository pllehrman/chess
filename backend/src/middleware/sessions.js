const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require ('../db/models');
const { app } = express();

const useSessions = () => {
    const sessionStore = new SequelizeStore({
        db: sequelize,
    });
    
    app.use(session({
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000 // 1 hour
        }
    }));
    
    sessionStore.sync();
};

module.exports = useSessions;
