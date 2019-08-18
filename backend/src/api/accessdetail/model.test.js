import { Accessdetail } from '.'

let accessdetail

beforeEach(async () => {
  accessdetail = await Accessdetail.create({ datetime: 'test', where: 'test', starttime: 'test', endtime: 'test', readyforbeam: 'test', week_number: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = accessdetail.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(accessdetail.id)
    expect(view.datetime).toBe(accessdetail.datetime)
    expect(view.where).toBe(accessdetail.where)
    expect(view.starttime).toBe(accessdetail.starttime)
    expect(view.endtime).toBe(accessdetail.endtime)
    expect(view.readyforbeam).toBe(accessdetail.readyforbeam)
    expect(view.week_number).toBe(accessdetail.week_number)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = accessdetail.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(accessdetail.id)
    expect(view.datetime).toBe(accessdetail.datetime)
    expect(view.where).toBe(accessdetail.where)
    expect(view.starttime).toBe(accessdetail.starttime)
    expect(view.endtime).toBe(accessdetail.endtime)
    expect(view.readyforbeam).toBe(accessdetail.readyforbeam)
    expect(view.week_number).toBe(accessdetail.week_number)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
