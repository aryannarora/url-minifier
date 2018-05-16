const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CounterSchema = Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        default: 0
    }
})

const counter = mongoose.model('counter', CounterSchema);

const antURISchema = Schema({
  _id: {
      type: Number,
    },
  longUrl: String,
}, {
    timestamps: { createdAt: "created_at" }
})


antURISchema.pre('save', function(next){
    const curr = this;
    counter.findByIdAndUpdate({_id: 'URIcount'}, {$inc: {seq: 1} }, function(error, counter) {
        if (error)
            return next(error);
        curr._id = counter.seq;
        next();
    });
});

const antURI = mongoose.model('antURIs', antURISchema)

module.exports = antURI;

