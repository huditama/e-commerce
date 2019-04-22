const { verify } = require('../helpers/jwt')

module.exports = (req, res, next) => {
    const decoded = verify(req.headers.token)
    if (decoded.role == 'admin') next()
    else res.status(401).json({ type: 'AUTHORIZATION ERROR', message: 'You do not have access to this page!' })
}