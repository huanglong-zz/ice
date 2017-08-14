const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const WikiCharacterSchema = new mongoose.Schema({
  _id: String,
  wikiId: Number,
  nmId: String,
  chId: String,
  name: String,
  cname: String,
  playedBy: String,
  profile: String,
  images: [
    String
  ],
  sections: Mixed,
  intro: [
    String,
  ],
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

WikiCharacterSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

const WikiCharacter = mongoose.model('WikiCharacter', WikiCharacterSchema)

