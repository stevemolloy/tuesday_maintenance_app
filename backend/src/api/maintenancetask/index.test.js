import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Maintenancetask } from '.'

const app = () => express(apiRoot, routes)

let maintenancetask

beforeEach(async () => {
  maintenancetask = await Maintenancetask.create({})
})

test('POST /maintenancetasks 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ datetime: 'test', reporter: 'test', fixer: 'test', where: 'test', task: 'test', starttime: 'test', endtime: 'test', approved: 'test', week_number: 'test', archived: 'test', done: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.datetime).toEqual('test')
  expect(body.reporter).toEqual('test')
  expect(body.fixer).toEqual('test')
  expect(body.where).toEqual('test')
  expect(body.task).toEqual('test')
  expect(body.starttime).toEqual('test')
  expect(body.endtime).toEqual('test')
  expect(body.approved).toEqual('test')
  expect(body.week_number).toEqual('test')
  expect(body.archived).toEqual('test')
  expect(body.done).toEqual('test')
})

test('GET /maintenancetasks 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /maintenancetasks/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${maintenancetask.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(maintenancetask.id)
})

test('GET /maintenancetasks/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /maintenancetasks/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${maintenancetask.id}`)
    .send({ datetime: 'test', reporter: 'test', fixer: 'test', where: 'test', task: 'test', starttime: 'test', endtime: 'test', approved: 'test', week_number: 'test', archived: 'test', done: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(maintenancetask.id)
  expect(body.datetime).toEqual('test')
  expect(body.reporter).toEqual('test')
  expect(body.fixer).toEqual('test')
  expect(body.where).toEqual('test')
  expect(body.task).toEqual('test')
  expect(body.starttime).toEqual('test')
  expect(body.endtime).toEqual('test')
  expect(body.approved).toEqual('test')
  expect(body.week_number).toEqual('test')
  expect(body.archived).toEqual('test')
  expect(body.done).toEqual('test')
})

test('PUT /maintenancetasks/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ datetime: 'test', reporter: 'test', fixer: 'test', where: 'test', task: 'test', starttime: 'test', endtime: 'test', approved: 'test', week_number: 'test', archived: 'test', done: 'test' })
  expect(status).toBe(404)
})
