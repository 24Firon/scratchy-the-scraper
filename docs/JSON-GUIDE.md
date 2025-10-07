# JSON Complete Guide - Fuer Scratchy-The-Scraper

Diese Datei enthaelt ALLES ueber JSON: Syntax, Parsing, Manipulation, Validation, jq, Best Practices.

## Was ist JSON?

JSON = JavaScript Object Notation:
- Text-basiertes Daten-Format
- Human-readable
- Language-agnostic (nicht nur JavaScript)
- Standard fuer Data-Interchange (APIs, Config-Files)

### JSON vs. XML vs. YAML

|Feature|JSON|XML|YAML|
|-------|----|----|-----|
|Syntax|{} []|<></>|Indentation|
|Readability|Gut|Kompliziert|Sehr gut|
|File Size|Klein|Gross|Klein|
|Parsing-Speed|Schnell|Langsam|Langsam|
|Data Types|Ja|Nein|Ja|
|Use-Case|APIs|Config|Config|

### Warum JSON fuer Scratchy?

1. Next.js-Data ist JSON (script#__NEXT_DATA__)
2. Output-Format ist JSON (posts.json, links.json)
3. APIs sprechen JSON
4. npm packages (package.json)

## JSON Syntax

### Basic Structure

Object (Key-Value Pairs):
{
  "name": "John",
  "age": 30
}

Array:
[1, 2, 3]

Nested:
{
  "user": {
    "name": "Alice",
    "posts": [
      {"title": "Post 1"},
      {"title": "Post 2"}
    ]
  }
}

### Data Types

String:
"Hello World"
"123" (Numbers in quotes = String!)

Number:
42
3.14
-10
1.5e10

Boolean:
true
false

Null:
null

Array:
[1, 2, 3]
["a", "b", "c"]
[{"id": 1}, {"id": 2}]

Object:
{"key": "value"}

### Syntax-Rules

1. Keys MUST be Strings (double quotes):
{"name": "John"} ✓
{name: "John"} ✗

2. Strings MUST be double quotes:
"Hello" ✓
'Hello' ✗

3. NO trailing commas:
{"a": 1, "b": 2} ✓
{"a": 1, "b": 2,} ✗

4. NO comments:
// Not allowed in JSON

5. NO undefined, NaN, Infinity:
null ✓
undefined ✗

### Escape Characters

Backslash:
"\\"

Quote:
"\""

Newline:
"\n"

Tab:
"\t"

Unicode:
"\u0041" → "A"

Example:
{
  "message": "Hello \"World\"\nNew Line"
}

## JSON in JavaScript

### JSON.parse()

String → Object:
const jsonString = '{"name": "Alice", "age": 30}'
const obj = JSON.parse(jsonString)

console.log(obj.name)
// Alice

Array:
const jsonString = '[1, 2, 3]'
const arr = JSON.parse(jsonString)

console.log(arr[0])
// 1

Error-Handling:
try {
  const obj = JSON.parse(invalidJson)
} catch (error) {
  console.error('JSON parse error:', error.message)
}

### JSON.stringify()

Object → String:
const obj = { name: 'Alice', age: 30 }
const jsonString = JSON.stringify(obj)

console.log(jsonString)
// {"name":"Alice","age":30}

Pretty-Print (Formatting):
JSON.stringify(obj, null, 2)

Output:
{
  "name": "Alice",
  "age": 30
}

Replacer Function:
JSON.stringify(obj, (key, value) => {
  if (key === 'password') return undefined
  return value
})

toJSON() Method:
class User {
  constructor(name, password) {
    this.name = name
    this.password = password
  }
  
  toJSON() {
    return { name: this.name }
  }
}

const user = new User('Alice', 'secret')
JSON.stringify(user)
// {"name":"Alice"}

### Deep vs. Shallow Copy

Shallow Copy (Reference):
const obj1 = { user: { name: 'Alice' } }
const obj2 = obj1
obj2.user.name = 'Bob'
console.log(obj1.user.name)
// Bob (CHANGED!)

Deep Copy (JSON):
const obj1 = { user: { name: 'Alice' } }
const obj2 = JSON.parse(JSON.stringify(obj1))
obj2.user.name = 'Bob'
console.log(obj1.user.name)
// Alice (UNCHANGED)

ACHTUNG: JSON deep copy hat Limits:
- Functions werden ignoriert
- undefined wird ignoriert
- Date-Objects werden zu Strings
- Infinity/NaN werden zu null

Better Deep Copy:
npm install lodash

const _ = require('lodash')
const obj2 = _.cloneDeep(obj1)

## JSON Manipulation

### Accessing Values

Dot Notation:
const obj = { name: 'Alice' }
console.log(obj.name)
// Alice

Bracket Notation:
const obj = { name: 'Alice' }
console.log(obj['name'])
// Alice

Dynamic Keys:
const key = 'name'
console.log(obj[key])
// Alice

Nested:
const obj = { user: { name: 'Alice' } }
console.log(obj.user.name)
// Alice

### Optional Chaining

Without:
const name = obj.user && obj.user.name

With:
const name = obj.user?.name

Arrays:
const first = arr?.[0]

Functions:
const result = obj.method?.()

### Modifying Values

Set:
obj.name = 'Bob'
obj['name'] = 'Bob'

Delete:
delete obj.name

Add:
obj.newKey = 'value'

Nested:
obj.user.name = 'Bob'

### Merging Objects

Object.assign():
const obj1 = { a: 1 }
const obj2 = { b: 2 }
const merged = Object.assign({}, obj1, obj2)
// { a: 1, b: 2 }

Spread Operator:
const merged = { ...obj1, ...obj2 }

Deep Merge:
npm install lodash

const _ = require('lodash')
const merged = _.merge(obj1, obj2)

### Filtering Arrays

Filter:
const posts = [
  { id: 1, published: true },
  { id: 2, published: false }
]

const published = posts.filter(p => p.published)
// [{ id: 1, published: true }]

### Mapping Arrays

Map:
const posts = [
  { id: 1, title: 'Post 1' },
  { id: 2, title: 'Post 2' }
]

const titles = posts.map(p => p.title)
// ['Post 1', 'Post 2']

### Reducing Arrays

Reduce:
const posts = [
  { id: 1, views: 100 },
  { id: 2, views: 200 }
]

const totalViews = posts.reduce((sum, p) => sum + p.views, 0)
// 300

## JSON Schema

### Was ist JSON Schema?

JSON Schema = Schema-Definition fuer JSON:
- Validation
- Documentation
- Code-Generation

Beispiel-Schema:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "integer",
      "minimum": 0
    },
    "email": {
      "type": "string",
      "format": "email"
    }
  },
  "required": ["name", "email"]
}

### Validation in Node.js

npm install ajv

const Ajv = require('ajv')
const ajv = new Ajv()

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'integer' }
  },
  required: ['name']
}

const validate = ajv.compile(schema)

const data = { name: 'Alice', age: 30 }
const valid = validate(data)

if (!valid) {
  console.log(validate.errors)
}

### JSON Schema Types

type:
- "string"
- "number"
- "integer"
- "boolean"
- "null"
- "array"
- "object"

format (fuer Strings):
- "email"
- "uri"
- "date" (ISO 8601)
- "date-time"
- "ipv4"
- "ipv6"

### JSON Schema Constraints

String:
{
  "type": "string",
  "minLength": 3,
  "maxLength": 20,
  "pattern": "^[A-Za-z]+$"
}

Number:
{
  "type": "integer",
  "minimum": 0,
  "maximum": 100,
  "multipleOf": 5
}

Array:
{
  "type": "array",
  "items": { "type": "string" },
  "minItems": 1,
  "maxItems": 10,
  "uniqueItems": true
}

Object:
{
  "type": "object",
  "properties": {
    "name": { "type": "string" }
  },
  "required": ["name"],
  "additionalProperties": false
}

### Scratchy Schema

Scratchy Output-Schema:
{
  "type": "object",
  "properties": {
    "posts": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "content": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" }
        },
        "required": ["id", "title"]
      }
    }
  }
}

## jq (Command-Line JSON Processor)

### Was ist jq?

jq = sed/awk fuer JSON:
- Command-Line Tool
- Filter, Map, Transform JSON
- Extrem powerful

### Installation

Ubuntu:
sudo apt install jq

Check:
jq --version
Output: jq-1.6

### Basic Usage

Pretty-Print:
cat file.json | jq .

Output:
{
  "name": "Alice",
  "age": 30
}

Select Field:
cat file.json | jq '.name'
Output: "Alice"

Select Multiple:
cat file.json | jq '.name, .age'

### Arrays

All Elements:
echo '[1, 2, 3]' | jq '.[]'
Output:
1
2
3

First Element:
echo '[1, 2, 3]' | jq '.[0]'
Output: 1

Last Element:
echo '[1, 2, 3]' | jq '.[-1]'
Output: 3

Slice:
echo '[1, 2, 3, 4]' | jq '.[1:3]'
Output: [2, 3]

### Objects

Select Field:
echo '{"user": {"name": "Alice"}}' | jq '.user.name'
Output: "Alice"

All Keys:
echo '{"a": 1, "b": 2}' | jq 'keys'
Output: ["a", "b"]

All Values:
echo '{"a": 1, "b": 2}' | jq '.[]'
Output:
1
2

### Filtering

Select by Value:
echo '[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]' | jq '.[] | select(.age > 26)'

Output:
{"name": "Alice", "age": 30}

Select by Key:
echo '[{"name": "Alice"}, {"title": "Post"}]' | jq '.[] | select(has("name"))'

Output:
{"name": "Alice"}

### Mapping

Map Array:
echo '[{"price": 10}, {"price": 20}]' | jq '[.[] | .price]'

Output:
[10, 20]

Map Object:
echo '[{"name": "Alice"}, {"name": "Bob"}]' | jq '[.[] | .name]'

Output:
["Alice", "Bob"]

### Advanced jq

Length:
echo '[1, 2, 3]' | jq 'length'
Output: 3

Unique:
echo '[1, 2, 2, 3]' | jq 'unique'
Output: [1, 2, 3]

Sort:
echo '[3, 1, 2]' | jq 'sort'
Output: [1, 2, 3]

Group By:
echo '[{"type": "a", "val": 1}, {"type": "a", "val": 2}, {"type": "b", "val": 3}]' | jq 'group_by(.type)'

Min/Max:
echo '[1, 2, 3]' | jq 'min'
Output: 1

Sum:
echo '[1, 2, 3]' | jq 'add'
Output: 6

### jq in Scripts

Bash Script:
#!/bin/bash

POSTS=$(cat posts.json | jq -r '.[] | .title')

for post in $POSTS; do
  echo "Post: $post"
done

Extract to Variable:
NAME=$(echo '{"name": "Alice"}' | jq -r '.name')
echo $NAME
# Alice

### Scratchy jq-Usage

Validate Output:
cat output/skool-*/posts.json | jq .

Count Posts:
cat output/skool-*/posts.json | jq 'length'

Extract Titles:
cat output/skool-*/posts.json | jq '[.[] | .title]'

Filter by Author:
cat output/skool-*/posts.json | jq '.[] | select(.author == "Alice")'

## JSON Best Practices

### 1. Naming Conventions

camelCase (JavaScript):
{
  "firstName": "Alice",
  "lastName": "Smith"
}

snake_case (Python):
{
  "first_name": "Alice",
  "last_name": "Smith"
}

Consistency: Waehle EINE Konvention!

### 2. Avoid Deep Nesting

Bad:
{
  "user": {
    "profile": {
      "settings": {
        "notifications": {
          "email": true
        }
      }
    }
  }
}

Good:
{
  "userEmailNotifications": true
}

### 3. Use Arrays for Lists

Bad:
{
  "post1": {...},
  "post2": {...}
}

Good:
{
  "posts": [
    {...},
    {...}
  ]
}

### 4. Date Format: ISO 8601

Good:
{
  "timestamp": "2025-10-07T22:00:00Z"
}

Bad:
{
  "timestamp": "07.10.2025 22:00"
}

### 5. Null vs. Missing

Null (explicit absence):
{
  "middleName": null
}

Missing (field doesn't exist):
{
  "firstName": "Alice"
}

Empfehlung: Omit optional fields (missing), use null nur wenn "no value" wichtig ist.

### 6. Avoid Reserved Words

Bad:
{
  "class": "A",
  "delete": true
}

Good:
{
  "className": "A",
  "isDeleted": true
}

### 7. Validation

IMMER Validierung bei Input:
const schema = {...}
const validate = ajv.compile(schema)

if (!validate(data)) {
  throw new Error('Invalid JSON')
}

### 8. Compression

Fuer grosse JSON-Files:
npm install zlib

const zlib = require('zlib')
const compressed = zlib.gzipSync(JSON.stringify(data))

### 9. Streaming fuer grosse Files

npm install stream-json

const { parser } = require('stream-json')
const { streamArray } = require('stream-json/streamers/StreamArray')

fs.createReadStream('large.json')
  .pipe(parser())
  .pipe(streamArray())
  .on('data', ({value}) => {
    console.log(value)
  })

## Common Pitfalls

### 1. Trailing Commas

Error:
{
  "name": "Alice",
  "age": 30,
}

Fix:
{
  "name": "Alice",
  "age": 30
}

### 2. Single Quotes

Error:
{'name': 'Alice'}

Fix:
{"name": "Alice"}

### 3. Comments

Error:
{
  // This is a comment
  "name": "Alice"
}

Fix: Use separate documentation OR JSON5 (supports comments)

### 4. undefined

Error:
JSON.stringify({ name: undefined })
Output: {}

Fix:
JSON.stringify({ name: null })
Output: {"name":null}

### 5. Circular References

Error:
const obj = {}
obj.self = obj
JSON.stringify(obj)
// TypeError: Converting circular structure to JSON

Fix:
npm install flatted

const { stringify } = require('flatted')
stringify(obj)

### 6. Large Numbers

Problem: JavaScript Number precision (53 bits)

Error:
JSON.parse('{"id": 9007199254740993}')
// Precision loss!

Fix:
npm install json-bigint

const JSONbig = require('json-bigint')
JSONbig.parse('{"id": 9007199254740993}')

## Scratchy JSON-Patterns

### Next.js JSON-Extraction

const nextData = await page.evaluate(() => {
  const script = document.querySelector('script#__NEXT_DATA__')
  if (!script) return null
  
  try {
    return JSON.parse(script.textContent)
  } catch (error) {
    console.error('JSON parse error:', error)
    return null
  }
})

if (!nextData) {
  throw new Error('Next.js data not found')
}

const posts = nextData.props?.pageProps?.postTrees || []

### Nested JSON-Parsing

Skool metadata.contributors ist JSON-String:
const metadata = post.metadata

if (typeof metadata.contributors === 'string') {
  try {
    metadata.contributors = JSON.parse(metadata.contributors)
  } catch {
    metadata.contributors = []
  }
}

### Output-Writing

import fs from 'fs/promises'
import path from 'path'

const outputDir = path.join(process.cwd(), 'output')
await fs.mkdir(outputDir, { recursive: true })

const filepath = path.join(outputDir, 'posts.json')
await fs.writeFile(filepath, JSON.stringify(posts, null, 2))

console.log(`Saved ${posts.length} posts to ${filepath}`)

### Validation

function validatePost(post) {
  if (!post.id || typeof post.id !== 'string') {
    throw new Error('Post must have id (string)')
  }
  
  if (!post.title || typeof post.title !== 'string') {
    throw new Error('Post must have title (string)')
  }
  
  return true
}

posts.forEach(validatePost)

## Resources

Official Spec:
https://www.json.org

JSON Schema:
https://json-schema.org

jq Manual:
https://jqlang.org/manual

jq Playground:
https://jqplay.org

JSON Validator:
https://jsonlint.com

## Naechste Datei

Keine weiteren Core-Guides noetig.
Optional: docs/REGEX-GUIDE.md, docs/SECURITY-GUIDE.md

Ende des JSON-Guides.
