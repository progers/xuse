#!/bin/sh
#
# Script for running regular use tests using Chromium's testing infrastructure.
#
# Arguments required:
#   -c chromium directory
#   -t test directory

chromiumdir=
testdir=`pwd`/tests

echo "runtests-use.sh -c [chromium directory] -t [test directory]"

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

`$chromiumdir/src/third_party/WebKit/Tools/Scripts/run-webkit-tests --release  --results-directory=$testdir --test-list=$testdir/testlist.txt`
