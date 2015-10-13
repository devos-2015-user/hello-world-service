'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');
var minimist = require('minimist');
var runSequence = require('run-sequence');

var args = minimist(process.argv.slice(2), { string: ['tag'] });
var options = {
  serviceName: 'hello-world-service',
  registryHost: '46.101.193.82',
  registryPort: '5000',
  versionTag: /^v?\d+\.\d+\.\d+$/.test(args.tag) ? args.tag.replace(/^v/, '') : undefined // do we have a version tag?
}

console.log(options);

gulp.task('test', function (done) {
  done(); // Nothing here yet ;-)
});

gulp.task('start-registry-forwarder', function () {
  return gulp.src('', { read: false })
    .pipe(shell('docker run --privileged -d -p 5000:5000 -e REGISTRY_HOST="<%= registryHost %>" -e REGISTRY_PORT="<%= registryPort %>" rsmoorthy/registry-forwarder', { templateData: options }));
});

gulp.task('build-container', function () {
  return gulp.src('', { read: false })
    .pipe(shell('docker build -t <%= serviceName %> .', { templateData: options }));
});

gulp.task('tag-container', function () {
  return gulp.src('', { read: false })
    .pipe(shell('docker tag <%= serviceName %> localhost:5000/<%= serviceName %>:<%= versionTag %>', { templateData: options }));
});

gulp.task('push-container', function () {
  return gulp.src('', { read: false })
    .pipe(shell('docker push localhost:5000/<%= serviceName %>:<%= versionTag %>', { templateData: options }));
});

gulp.task('dockerize', function (done) {
  runSequence('start-registry-forwarder', 'build-container', 'tag-container', 'push-container', done);
});

gulp.task('ci-build', function (done) {
  runSequence.apply(null, options.versionTag ? ['test', 'dockerize', done] : ['test', done]);
});

gulp.task('default', ['test'], function () {});
