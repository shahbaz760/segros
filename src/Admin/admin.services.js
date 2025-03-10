
export default class Admin {
  async init(db) {
    this.Models = db.models;
    this.sql = db.sqlClient
  };

  /* get user list by query */
  getAllUsersByQuery = async (query) => {
    return await this.Models.Users.findAll({ where: query, attributes: { exclude: ['password'] } })
  };
  /* end */

}
