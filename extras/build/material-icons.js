const prefix = 'mat'
const packageName = 'material-design-icons'

let skipped = 0

// ------------

const glob = require('glob')
const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')

const dist = resolve(__dirname, `../${prefix}-svg.js`)

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/`)
const svgFiles = glob.sync(svgFolder + '/*/svg/production/ic_*_24px.svg')

function extract (file) {
  const content = readFileSync(file, 'utf-8')

  const name = (prefix + '_' + file.match(/ic_(.*)_24px\.svg/)[1])
    .replace(/(_\w)/g, m => m[1].toUpperCase())

  try {
    const dPath = content.match(/ d="([\w ,\.-]+)"/)[1]
    const viewBox = content.match(/viewBox="([0-9 ]+)"/)[1]

    return `export const ${name} = "${dPath}|${viewBox}"`
  }
  catch (err) {
    skipped++
    return null
  }
}

function getBanner () {
  const { version } = require(resolve(__dirname, `../node_modules/${packageName}/package.json`))
  return `/* Google Material Design Icons v${version} */\n\n`
}

const svgExports = []

svgFiles.forEach(file => {
  svgExports.push(extract(file))
})

writeFileSync(dist, getBanner() + svgExports.filter(x => x !== null).join('\n'), 'utf-8')

if (skipped > 0) {
  console.log('material-icons - skipped: ' + skipped)
}
