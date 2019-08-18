import { success, notFound } from '../../services/response/'
import { Maintenancetask } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Maintenancetask.create(body)
    .then((maintenancetask) => maintenancetask.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Maintenancetask.find(query, select, cursor)
    .then((maintenancetasks) => maintenancetasks.map((maintenancetask) => maintenancetask.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Maintenancetask.findById(params.id)
    .then(notFound(res))
    .then((maintenancetask) => maintenancetask ? maintenancetask.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Maintenancetask.findById(params.id)
    .then(notFound(res))
    .then((maintenancetask) => maintenancetask ? Object.assign(maintenancetask, body).save() : null)
    .then((maintenancetask) => maintenancetask ? maintenancetask.view(true) : null)
    .then(success(res))
    .catch(next)
