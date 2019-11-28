var Timer = require("../../../shared/code/Tools/STimer.js");

const SessionManager = {
    sessions: [],

    update(deltatime) {
        this.sessions.forEach(timer => {
            timer.tick(deltatime);
        });
    },

    addSession(sessionAge, user) {
        user.loggedin = true;
        this.sessions.push(new Timer(sessionAge/1000, () => {
            user.loggedin = false;
        }, false));
    }
};

module.exports = SessionManager;