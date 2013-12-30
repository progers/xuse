#!/bin/sh
#
# Script for running xuse tests using Chromium's testing infrastructure.
#
# This requires a Chromium checkout with content_shell built with
# AuthorShadowDOMForAnyElement and ShadowDOM enabled.
#
# Run with the following arguments:
#   -c chromium directory
#   -t test directory
#
# To add tests:
#   Copy test.html into the tests directory and create a copy: "test-expected.html".
#   Modify test.html to use xuse by adding <script src="xuse.js"></script> and
#   <script src="xusetests.js"></script>, and changing <use> to <g is='x-use'> in
#   test.html (but not test-expected.html).

chromiumdir=`pwd`/../chromium
testdir=`pwd`/tests

echo "runtests.sh -c [chromium directory] -t [test directory]"

while getopts ":c:t:" opt; do
  case $opt in
    c)
      chromiumdir=$OPTARG
      ;;
    t)
      testdir=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

if [ ! -d $testdir ]
then
  echo "Error: $testdir does not exist."
  exit 1
fi

if [ ! -f $testdir/testlist.txt ]
then
  echo "Error: $testdir/testlist.txt does not exist."
  exit 1
fi

if [ ! -f $chromiumdir/src/third_party/WebKit/Tools/Scripts/run-webkit-tests ]
then
  echo "Error: $chromiumdir/src/third_party/WebKit/Tools/Scripts/run-webkit-tests does not exist."
  exit 1
fi

# Run the tests
$chromiumdir/src/third_party/WebKit/Tools/Scripts/run-webkit-tests --release --results-directory=$testdir --test-list=$testdir/testlist.txt
