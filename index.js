var o = require('osmosis')
var fs = require('fs')
var stream = fs.createWriteStream('./data/data.json')

stream.on('error', function (err) {
  console.log('Error!')
  console.log(err)
})

var first = true

o.get('http://www.seedsavers.org/onlinestore/Vegetables/')
  .find('#blTableVegetables .bl_box')
  .follow('a@href')
  .find('#blTableItemList2')
  .follow('h4 a')
  .set({
    'name': '#blItemDetail h2',
    'catalogNumber': '#blItemDetail span',
    'info': '.bl_information td',
    'latinName': '.bl_information td em'
  })
  .then(function (context, data, next) {
    if(first){
      stream.write('[');
      first = false;
    } else {
      stream.write(',');
    }
    stream.write(JSON.stringify(data, null, 2))
    next()
  })
  .doc()
  .done(function () {
    stream.write(']');
    stream.end()
    console.log('done')
  })