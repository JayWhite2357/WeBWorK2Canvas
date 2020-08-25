./node_modules/browserify/bin/cmd.js WeBWorKConverter.js -o WW2ClibBig.js
#./node_modules/minify/bin/minify.js WW2ClibBig.js > WW2Clib.js
cat WW2ClibBig.js > WW2Clib.js
cp WW2Clib.js main.html ~/Downloads
