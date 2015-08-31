// [Chromium Blog: Irregexp, Google Chrome's New Regexp Implementation](http://blog.chromium.org/2009/02/irregexp-google-chromes-new-regexp.html)
// [irregexp: New fast Regexp engine in Chrome - Ajaxian](http://ajaxian.com/archives/irregexp-new-fast-regexp-engine-in-chrome)
// [提醒：chrome将使用一个全新的正则表达式引擎：Irregexp-哪吒网](http://inezha.com/p/6706891/item12)
var Benchmark = require('benchmark');
var benchmarks = require('beautify-benchmark');

var suite = new Benchmark.Suite();

function uncatchedGroupTest(name) {
  return /\.(?:js|json|properties)$/.test(name);
}
function catchedGroupTest(name) {
  return /\.(js|json|properties)$/.test(name);
}
function catchedGroupTest2(name) {
  return /\.(((js|json|properties)))$/.test(name);
}

function refCachedGroupTest(text) {
  return /(["']).*?\1/.test(text);
}
function unrefUncachedGroupTest(text) {
  return /(?:["']).*?(?:["'])/.test(text);
}
function unrefUncachedGroupTest2(text) {
  return /["'].*?["']/.test(text);
}

console.log('true:');
console.log('  uncatchedGroupTest("a.js"): %s', uncatchedGroupTest('a.js'));
console.log('  uncatchedGroupTest("a.json"): %s', uncatchedGroupTest('a.json'));
console.log('  uncatchedGroupTest("a.properties"): %s', uncatchedGroupTest('a.properties'));
console.log('  catchedGroupTest("a.js"): %s', catchedGroupTest('a.js'));
console.log('  catchedGroupTest("a.json"): %s', catchedGroupTest('a.json'));
console.log('  catchedGroupTest("a.properties"): %s', catchedGroupTest('a.properties'));

console.log('  refCachedGroupTest("\'a.properties\'"): %s', refCachedGroupTest('\'a.properties\''));
console.log('  refCachedGroupTest(\'"a.properties"\'): %s', refCachedGroupTest('"a.properties"'));
console.log('  unrefUncachedGroupTest("\'a.properties\'"): %s', unrefUncachedGroupTest('\'a.properties\''));
console.log('  unrefUncachedGroupTest(\'"a.properties"\'): %s', unrefUncachedGroupTest('"a.properties"'));
console.log('  unrefUncachedGroupTest2("\'a.properties\'"): %s', unrefUncachedGroupTest2('\'a.properties\''));
console.log('  unrefUncachedGroupTest2(\'"a.properties"\'): %s', unrefUncachedGroupTest2('"a.properties"'));

console.log('false:');
console.log('  uncatchedGroupTest("a.jsx"): %s', uncatchedGroupTest('a.jsx'));
console.log('  catchedGroupTest("a.jsx"): %s', catchedGroupTest('a.jsx'));

console.log('  refCachedGroupTest("a.properties"): %s', refCachedGroupTest('a.properties'));
console.log('  unrefUncachedGroupTest("a.properties"): %s', unrefUncachedGroupTest('a.properties'));
console.log('  unrefUncachedGroupTest2("a.properties"): %s', unrefUncachedGroupTest2('a.properties'));


suite

.add('catchedGroupTest(...)', function() {
  catchedGroupTest('a.js');
  catchedGroupTest('a.json');
  catchedGroupTest('a.properties');
  catchedGroupTest('a.jsx');
})
.add('catchedGroupTest2(...)', function() {
  catchedGroupTest2('a.js');
  catchedGroupTest2('a.json');
  catchedGroupTest2('a.properties');
  catchedGroupTest2('a.jsx');
})
.add('uncatchedGroupTest(...)', function() {
  uncatchedGroupTest('a.js');
  uncatchedGroupTest('a.json');
  uncatchedGroupTest('a.properties');
  uncatchedGroupTest('a.jsx');
})
.add('refCachedGroupTest(...)', function() {
  refCachedGroupTest('\'a.properties\'');
  refCachedGroupTest('"a.properties"');
  refCachedGroupTest('a.properties');
})
.add('unrefUncachedGroupTest(...)', function() {
  unrefUncachedGroupTest('\'a.properties\'');
  unrefUncachedGroupTest('"a.properties"');
  unrefUncachedGroupTest('a.properties');
})
.add('unrefUncachedGroupTest2(...)', function() {
  unrefUncachedGroupTest2('\'a.properties\'');
  unrefUncachedGroupTest2('"a.properties"');
  unrefUncachedGroupTest2('a.properties');
})

.on('cycle', function(event) {
  benchmarks.add(event.target);
})
.on('start', function() {
  console.log('\n  catched group and uncatched group regexp Benchmark\n  node version: %s, date: %s\n  Starting...',
    process.version, Date());
})
.on('complete', function done() {
  benchmarks.log();
})
.run({ async: false });
