import mongoose, { Schema } from 'mongoose'

const maintenancetaskSchema = new Schema({
  datetime: {
    type: String
  },
  reporter: {
    type: String
  },
  fixer: {
    type: String
  },
  where: {
    type: String
  },
  task: {
    type: String
  },
  starttime: {
    type: String
  },
  endtime: {
    type: String
  },
  approved: {
    type: String
  },
  week_number: {
    type: String
  },
  archived: {
    type: String
  },
  done: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

maintenancetaskSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      datetime: this.datetime,
      reporter: this.reporter,
      fixer: this.fixer,
      where: this.where,
      task: this.task,
      starttime: this.starttime,
      endtime: this.endtime,
      approved: this.approved,
      week_number: this.week_number,
      archived: this.archived,
      done: this.done,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Maintenancetask', maintenancetaskSchema)

export const schema = model.schema
export default model
