#!/bin/bash
VERSION=$(cat package.json | grep version | awk '{print $2}' | sed 's/\"//g' | sed 's/\,//g' | sed 's/-/ /' | awk '{print $2}')
if  cat package.json| grep version | grep echo > /dev/null
then
ECHOTEG=$(cat package.json | grep version | awk '{print $2}' | sed 's/\"//g' | sed 's/\,//g' | sed 's/\-/\ /g' | awk '{print $2}')
npm publish --tag "$ECHOTEG"
elif [ -z "$VERSION" ]
then
npm publish
else
npm publish --tag "rc"
fi
