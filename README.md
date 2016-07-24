# codekit-scanner

```
$ npm install codekit-scanner
```

Scans Codekit dependencies of a core JS file like

```
// @codekit-prepend 'js/framework.utilities.js'
// @codekit-prepend 'js/framework.file.js'
// @codekit-prepend 'core.config.js'
(function(){
  console.log("Hello World, I am core.js");
})()
// @codekit-append 'modules/module.js'

// @codekit-append 'views/view.js'
```
Resolves dependencies by local JS directory and framework directory just like Codekit does.

## Gulp Integration

```
var codekit = require('codekit-scanner');

gulp.task('default', function () {
    codekit({file: 'js/core.js', fw: 'external/UIFramework', jsDir : 'js'}, function(files){
        console.log('files',files);
        gulp.src(files)
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concat('core-min.js'))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/js'));
    });
});
```
