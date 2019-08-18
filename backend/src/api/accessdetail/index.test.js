import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Accessdetail } from '.'

const app = () => express(apiRoot, routes)

let accessdetail

beforeEach(async () => {
  accessdetail = await Accessdetail.create({})
})

test('POST /accessdetails 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ datetime: 'test', where: 'test', starttime: 'test', endtime: 'test', readyforbeam: 'test', week_number: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.datetime).toEqual('test')
  expect(body.where).toEqual('test')
  expect(body.starttime).toEqual('test')
  expect(body.endtime).toEqual('test')
  expect(body.readyforbeam).toEqual('test')
  expect(body.week_number).toEqual('test')
})

test('GET /accessdetails 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /accessdetails/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${accessdetail.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(accessdetail.id)
})

test('GET /accessdetails/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /accessdetails/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${accessdetail.id}`)
    .send({ datetime: 'test', where: 'test', starttime: 'test', endtime: 'test', readyforbeam: 'test', week_number: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(accessdetail.id)
  expect(body.datetime).toEqual('test')
  expect(body.where).toEqual('test')
  expect(body.starttime).toEqual('test')
  expect(body.endtime).toEqual('test')
  expect(body.readyforbeam).toEqual('test')
  expect(body.week_number).toEqual('test')
})

test('PUT /accessdetails/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ datetime: 'test', where: 'test', starttime: 'test', endtime: 'test', readyforbeam: 'test', week_number: 'test' })
  expect(status).toBe(404)
})
