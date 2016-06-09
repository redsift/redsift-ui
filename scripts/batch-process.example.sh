#!/bin/bash

for f in *; do ~/projects/redsift-ui/scripts/forweb.sh $f processed/${f%%.*};done
