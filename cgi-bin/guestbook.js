#!/usr/bin/env node

const fs = require('fs')
const assert = require('assert')
const querystring = require('querystring')
const path = require('path')

const file = path.join(__dirname, '../guestbook.html')

const expected = Number(process.env.CONTENT_LENGTH)
const input = Buffer.alloc(expected)

const size = fs.readSync(process.stdin.fd, input).toString()
const payload = input.toString()
assert.equal(size, expected)

const fields = querystring.parse(payload)
const comments = fields.comments.replace(/\r\n/g, '<BR>\n')

const entry = `
<HR>
${comments}
<BR>
<B>${fields.name}<BR>
${fields.location}</B><BR>
`
fs.appendFileSync(file, entry)

process.stdout.write('Content-Type: text/html\n')

process.stdout.write(`
<html>
  <head>
    <meta http-equiv="refresh" content="0; url=/guestbook.html" />
    <title>Guestbook signed</title>
  </head>
  <body>
    Thanks for signing our guestbook!
    <a href="/guestbook.html">Click here</a> if you are not redirected.
  </body>
</html>`)
