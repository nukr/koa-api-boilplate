export function signup (username, password, app, chai) {
  return chai
    .request(app.listen())
    .post('/signup')
    .send({username, password})
}

export function service (serviceName, accessToken, app, chai) {
  return chai
    .request(app.listen())
    .post('/services')
    .send({service: serviceName})
    .set('X-Meepcloud-Access-Token', accessToken)
}

export function classes (className, serviceId, accessToken, app, chai) {
  return chai
    .request(app.listen())
    .post('/classes')
    .set('X-Meepcloud-Service-Id', serviceId)
    .set('X-Meepcloud-Access-Token', accessToken)
    .send({name: className})
}
