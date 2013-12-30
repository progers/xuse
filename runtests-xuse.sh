#!/bin/sh
#
# Script for running xuse tests using Chromium's testing infrastructure.
#
# FIXME: This is really hacky.
# This script copies the existing tests to xusetests, modifies them
# to use xuse instead of <use>, and runs the tests (against the normal
# <use> expectations). After the tests run, the xusetests directory is
# removed.
#
# Arguments required:
#   -c chromium directory
#   -t test directory

chromiumdir=
testdir=`pwd`/tests

echo "runtests-xuse.sh -c [chromium directory] -t [test directory]"

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

xusetestdir=$testdir/../xusetests/
xusescript="<script src=\"$testdir/../xuse.js\"></script>"
testlist="$testdir/testlist.txt"
xusetestlist="$xusetestdir/testlist.txt"

# Clean up: remove any existing xusetests
rm -rf $xusetestdir

# Copy the existing tests into $testdir/xusetests
cp -r $testdir $xusetestdir

# Update paths for xusetestdir's testlist.txt
# FIXME: This could be more general and will fail on paths containing 'tests/'.
sed -i '' 's/tests\//xusetests\//g' $xusetestlist

# Read in the list of xusetests
IFS=$'\n' read -d '' -r -a xusetests < $xusetestlist

for xusetest in "${xusetests[@]}"
do
  # Replace <use with <g is='x-use'
  sed -ie "s/<use/<g is='x-use' /g" $xusetest
  sed -ie "s/<\/use/<\/g/g" $xusetest
done

# Run the tests
`$chromiumdir/src/third_party/WebKit/Tools/Scripts/run-webkit-tests --release  --results-directory=$xusetestdir --test-list=$xusetestdir/testlist.txt`
