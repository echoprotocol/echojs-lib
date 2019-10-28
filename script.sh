#!/bin/bash
POSTFIXVERSION=$(cat package.json | grep version | awk '{print $2}' | sed 's/\"//g' | sed 's/\,//g' | sed 's/-/ /' | awk '{print $2}')
echo  $POSTFIXVERSION
if  [ -z "$POSTFIXVERSION" ]
then
npm publish
else
npm publish --tag "$POSTFIXVERSION V"
fi
