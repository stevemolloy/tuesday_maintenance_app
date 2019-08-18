import { Maintenancetask } from '.'

let maintenancetask

beforeEach(async () => {
  maintenancetask = await Maintenancetask.create({ datetime: 'test', reporter: 'test', fixer: 'test', where: 'test', task: 'test', starttime: 'test', endtime: 'test', approved: 'test', week_number: 'test', archived: 'test', done: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = maintenancetask.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(maintenancetask.id)
    expect(view.datetime).toBe(maintenancetask.datetime)
    expect(view.reporter).toBe(maintenancetask.reporter)
    expect(view.fixer).toBe(maintenancetask.fixer)
    expect(view.where).toBe(maintenancetask.where)
    expect(view.task).toBe(maintenancetask.task)
    expect(view.starttime).toBe(maintenancetask.starttime)
    expect(view.endtime).toBe(maintenancetask.endtime)
    expect(view.approved).toBe(maintenancetask.approved)
    expect(view.week_number).toBe(maintenancetask.week_number)
    expect(view.archived).toBe(maintenancetask.archived)
    expect(view.done).toBe(maintenancetask.done)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = maintenancetask.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(maintenancetask.id)
    expect(view.datetime).toBe(maintenancetask.datetime)
    expect(view.reporter).toBe(maintenancetask.reporter)
    expect(view.fixer).toBe(maintenancetask.fixer)
    expect(view.where).toBe(maintenancetask.where)
    expect(view.task).toBe(maintenancetask.task)
    expect(view.starttime).toBe(maintenancetask.starttime)
    expect(view.endtime).toBe(maintenancetask.endtime)
    expect(view.approved).toBe(maintenancetask.approved)
    expect(view.week_number).toBe(maintenancetask.week_number)
    expect(view.archived).toBe(maintenancetask.archived)
    expect(view.done).toBe(maintenancetask.done)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
