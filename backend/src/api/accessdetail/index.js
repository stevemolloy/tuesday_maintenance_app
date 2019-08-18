import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update } from './controller'
import { schema } from './model'
export Accessdetail, { schema } from './model'

const router = new Router()
const { datetime, where, starttime, endtime, readyforbeam, week_number } = schema.tree

/**
 * @api {post} /accessdetails Create accessdetail
 * @apiName CreateAccessdetail
 * @apiGroup Accessdetail
 * @apiParam datetime Accessdetail's datetime.
 * @apiParam where Accessdetail's where.
 * @apiParam starttime Accessdetail's starttime.
 * @apiParam endtime Accessdetail's endtime.
 * @apiParam readyforbeam Accessdetail's readyforbeam.
 * @apiParam week_number Accessdetail's week_number.
 * @apiSuccess {Object} accessdetail Accessdetail's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Accessdetail not found.
 */
router.post('/',
  body({ datetime, where, starttime, endtime, readyforbeam, week_number }),
  create)

/**
 * @api {get} /accessdetails Retrieve accessdetails
 * @apiName RetrieveAccessdetails
 * @apiGroup Accessdetail
 * @apiUse listParams
 * @apiSuccess {Object[]} accessdetails List of accessdetails.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /accessdetails/:id Retrieve accessdetail
 * @apiName RetrieveAccessdetail
 * @apiGroup Accessdetail
 * @apiSuccess {Object} accessdetail Accessdetail's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Accessdetail not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /accessdetails/:id Update accessdetail
 * @apiName UpdateAccessdetail
 * @apiGroup Accessdetail
 * @apiParam datetime Accessdetail's datetime.
 * @apiParam where Accessdetail's where.
 * @apiParam starttime Accessdetail's starttime.
 * @apiParam endtime Accessdetail's endtime.
 * @apiParam readyforbeam Accessdetail's readyforbeam.
 * @apiParam week_number Accessdetail's week_number.
 * @apiSuccess {Object} accessdetail Accessdetail's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Accessdetail not found.
 */
router.put('/:id',
  body({ datetime, where, starttime, endtime, readyforbeam, week_number }),
  update)

export default router
