require('dotenv').config();
import Server from './bin/server';
class Application {
    constructor() {
        this.app = "";
        this.port = "";
        this.server = "";
        this.serverObj = "";
        this.logger = "";
    }
    async initApp() {
        this.port = process.env.PORT;
        this.serverObj = new Server();
        // this.app = await this.serverObj.initServer();
        const { app, server } = await this.serverObj.initServer();
        this.app = app;
        this.server = server;
        this.app.set('port', this.port);
        this.server.listen(this.port, () => {
            console.log(`Server running on: ${this.port}`)
        })
    }
}
const app = new Application();
(async () => {
    process.setMaxListeners(0);
    await app.initApp();
})();
/* the unhandled rejection listener */
process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error);
});
/* end */