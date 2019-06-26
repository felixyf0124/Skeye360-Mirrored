#!/bin/sh
die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "1 argument required, $# provided"

[ ! -d "$1" ] || die "Directory $1 already exists"

react-native init "$1"

cd "$1"

# see https://codeburst.io/react-native-quirks-2fb1ae0bbf80
sed -i '$s/\}/  ,"rnpm": {\n    "assets": [\n      "..\/eds\/icon-font", "..\/eds\/hilda"\n    ]\n  }\n}/g' package.json

react-native link

# see https://github.com/oblador/react-native-vector-icons
npm install react-native-vector-icons --save

mkdir Ericsson

./node_modules/.bin/generate-icon ../eds/styles.css --componentName=EdsIcon --fontFamily=edsfont > Ericsson/EdsIcon.js
