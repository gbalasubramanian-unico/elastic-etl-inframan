var mongoose = require('mongoose');
var repoLogsSchema = new mongoose.Schema({
    orgId: String,
    repositoryId: String,
    status: String,
    lastUpdated: String
});

mongoose.model('repositorylogs', repoLogsSchema);