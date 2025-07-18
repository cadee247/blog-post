module.exports = (req, res) => {
  res.render('login', {
    errors: [],
    username: '',
    password: ''
  });
};
