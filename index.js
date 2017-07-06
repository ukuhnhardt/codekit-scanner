var fs          = require('fs')
    , readline  = require('readline')
    , q         = require('q')
    ;

module.exports = function (params, cb) {
    var params = params || {};
    if (!params.file || !params.fw || !params.jsDir) {
        return cb([]);
    }

    var instream = fs.createReadStream(params.file),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);

    var prependFiles        = [],
        appendFiles         = [],
        checkPrependFiles   = [],
        checkAppendFiles    = []
        ;

    var promises =[];

    function getFile(line) {
        return line.split(/@codekit-\w+/)[1].replace(/['";]/g, "").trim();
    }

    function addFileQ(soFar, jsFile) {
        var deferred = q.defer();
        fs.access(params.fw + "/" + jsFile, fs.R_OK, function (fwErr) {
            if (fwErr) {
                fs.access(params.jsDir + '/' + jsFile, fs.R_OK, function(jsDirErr){
                    if (jsDirErr){
                        throw new Error("FATAL ERROR " + jsFile + " does not exist in Framework or locally. Abort Build" );
                    }
                    var file = params.jsDir + '/' + jsFile;
                    soFar.push(file);
                    deferred.resolve();
                });
            } else {
                var file = params.fw + "/" + jsFile;
                soFar.push(file);
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    rl.on('line', function (line) {
        if (line.indexOf('@codekit-prepend') > 0){
            var prependFile = getFile(line);
            checkPrependFiles.push(prependFile);
        }
        if (line.indexOf('@codekit-append') > 0){
            var appendFile = getFile(line);
            checkAppendFiles.push(appendFile);
        }
    });

    function finishQ() {
        var result = q(prependFiles);
        //console.log("check prepend", checkPrependFiles);
        checkPrependFiles.forEach(function (f){
            result = result.then(addFileQ.bind(null, prependFiles, f));
        });
        //console.log("check append", checkAppendFiles);
        checkAppendFiles.forEach(function (f){
            result = result.then(addFileQ.bind(null, appendFiles, f))
        });
        return result;
    }

    rl.on('close', function (line) {
        //console.log('done reading file ', params.file);
        finishQ().then(function(){
            prependFiles.push(params.file);
            cb(prependFiles.concat(appendFiles));
        });
    });

    return ;
};
