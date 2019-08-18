import { success, notFound } from '../../services/response/'
import { Accessdetail } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Accessdetail.create(body)
    .then((accessdetail) => accessdetail.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Accessdetail.find(query, select, cursor)
    .then((accessdetails) => accessdetails.map((accessdetail) => accessdetail.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Accessdetail.findById(params.id)
    .then(notFound(res))
    .then((accessdetail) => accessdetail ? accessdetail.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Accessdetail.findById(params.id)
    .then(notFound(res))
    .then((accessdetail) => accessdetail ? Object.assign(accessdetail, body).save() : null)
    .then((accessdetail) => accessdetail ? accessdetail.view(true) : null)
    .then(success(res))
    .catch(next)
