// 从本地 wrangler dev 导出 openapi.json
const res = await fetch('http://127.0.0.1:8787/openapi.json')
const json = await res.json()
import { writeFileSync } from 'fs'
writeFileSync('openapi.json', JSON.stringify(json, null, 2))
console.log('openapi.json exported')
