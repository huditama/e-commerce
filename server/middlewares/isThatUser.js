const { verify } = require('../helpers/jwt')

module.exports = (req, res, next) => {
    const decoded = verify(req.headers.token)
    if (decoded.id == req.authenticatedUser.id) next()
    else res.status(401).json({ type: 'AUTHORIZATION ERROR', message: 'You do not have access to this page!' })
}