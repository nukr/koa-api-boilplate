import crypto from 'crypto'

export default (password) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, 'salt', 10000, 512, 'sha256', (err, key) => {
      if (err) reject(err)
      resolve(key.toString('hex'))
    })
  })
}
