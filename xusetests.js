// xusetests.js
//
// FIXME: It's not clear why content shell is terminating before the
//        onload event fires. This file should have no effect.       
if (window.testRunner) {
  testRunner.waitUntilDone();
  window.addEventListener("load", function load(event) {
    testRunner.notifyDone();
  }, false);
}