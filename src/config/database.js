module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'meetapp-pg',
  password: 'meetapp',
  database: 'meetapp',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
