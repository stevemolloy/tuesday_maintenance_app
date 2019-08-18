import mongoose, { Schema } from 'mongoose'

const accessdetailSchema = new Schema({
  datetime: {
    type: String
  },
  where: {
    type: String
  },
  starttime: {
    type: String
  },
  endtime: {
    type: String
  },
  readyforbeam: {
    type: String
  },
  week_number: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

accessdetailSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      datetime: this.datetime,
      where: this.where,
      starttime: this.starttime,
      endtime: this.endtime,
      readyforbeam: this.readyforbeam,
      week_number: this.week_number,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Accessdetail', accessdetailSchema)

export const schema = model.schema
export default model
