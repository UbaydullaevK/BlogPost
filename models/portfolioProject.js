const portfolioScheme = mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    startedDate: {
        type: String,
        required: true
    },
    completedDate: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    projectOverview: {
        type: String,
        required: true
    },
    projectLocation: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('PortfolioProject', portfolioScheme)