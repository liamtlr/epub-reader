# Setup

Assumes node and npm installation

1. Clone the repo

```
git clone https://github.com/liamtlr/epub-reader.git
```
2. Install dependencies

```
cd epub-reader
npm init
```
3. Require module and run script
```
node
> const r = require('./index.js').EPubReader;
> const reader = new r()
> r.readFolder()

4. Alternatively you can specify your own source and target folders to read by supplying paths as respective arguments to readFolder.
