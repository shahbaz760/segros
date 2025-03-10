import authController from "../Auth/auth.controller";
import Services from "./admin.services";
export default class Admin {
  async init(db) {
    this.services = new Services();
    this.authController = new authController();
    this.Models = db.models;
    await this.services.init(db);
    await this.authController.init(db);
  }
}
