import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update } from './controller'
import { schema } from './model'
export Maintenancetask, { schema } from './model'

const router = new Router()
const { datetime, reporter, fixer, where, task, starttime, endtime, approved, week_number, archived, done } = schema.tree

/**
 * @api {post} /maintenancetasks Create maintenancetask
 * @apiName CreateMaintenancetask
 * @apiGroup Maintenancetask
 * @apiParam datetime Maintenancetask's datetime.
 * @apiParam reporter Maintenancetask's reporter.
 * @apiParam fixer Maintenancetask's fixer.
 * @apiParam where Maintenancetask's where.
 * @apiParam task Maintenancetask's task.
 * @apiParam starttime Maintenancetask's starttime.
 * @apiParam endtime Maintenancetask's endtime.
 * @apiParam approved Maintenancetask's approved.
 * @apiParam week_number Maintenancetask's week_number.
 * @apiParam archived Maintenancetask's archived.
 * @apiParam done Maintenancetask's done.
 * @apiSuccess {Object} maintenancetask Maintenancetask's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Maintenancetask not found.
 */
router.post('/',
  body({ datetime, reporter, fixer, where, task, starttime, endtime, approved, week_number, archived, done }),
  create)

/**
 * @api {get} /maintenancetasks Retrieve maintenancetasks
 * @apiName RetrieveMaintenancetasks
 * @apiGroup Maintenancetask
 * @apiUse listParams
 * @apiSuccess {Object[]} maintenancetasks List of maintenancetasks.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /maintenancetasks/:id Retrieve maintenancetask
 * @apiName RetrieveMaintenancetask
 * @apiGroup Maintenancetask
 * @apiSuccess {Object} maintenancetask Maintenancetask's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Maintenancetask not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /maintenancetasks/:id Update maintenancetask
 * @apiName UpdateMaintenancetask
 * @apiGroup Maintenancetask
 * @apiParam datetime Maintenancetask's datetime.
 * @apiParam reporter Maintenancetask's reporter.
 * @apiParam fixer Maintenancetask's fixer.
 * @apiParam where Maintenancetask's where.
 * @apiParam task Maintenancetask's task.
 * @apiParam starttime Maintenancetask's starttime.
 * @apiParam endtime Maintenancetask's endtime.
 * @apiParam approved Maintenancetask's approved.
 * @apiParam week_number Maintenancetask's week_number.
 * @apiParam archived Maintenancetask's archived.
 * @apiParam done Maintenancetask's done.
 * @apiSuccess {Object} maintenancetask Maintenancetask's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Maintenancetask not found.
 */
router.put('/:id',
  body({ datetime, reporter, fixer, where, task, starttime, endtime, approved, week_number, archived, done }),
  update)

export default router
