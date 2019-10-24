#!/bin/bash
npx npm-login-cmd
VERSION=$(cat package.json | grep version | awk '{print $2}' | sed 's/\"//g' | sed 's/\,//g' | sed 's/-/ /' | awk '{print $2}')
echo  $VERSION
if  [ -z "$VERSION" ]
then
npm publish
else
npm publish --tag "$VERSION V"
fi
