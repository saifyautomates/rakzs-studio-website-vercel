module.exports = (req, res) => {
  res.status(200).json({
    status: 'ok',
    studio: 'Rakzs Studio',
    message: 'Backend API operational',
    timestamp: new Date().toISOString()
  });
};
