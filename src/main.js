var path = require( 'path' )
var fs = require( 'fs' )

// Load configuration file
var config = require( path.resolve( './', 'config.json' ) )


// Iniitialize CODE
var express = require( 'express' )
var server = express()
server.use( express.static( './' ) )
server.listen( config.ports.code )

// Iniitialize uuid server
server.get('/uuid', function(req, res) {
	var uuids = fs.readdirSync('uuids').filter(uuid => uuid.endsWith('.hex'))
	if(!uuids.length){
		return res.json({
			success: false,
			message: 'No uuids left.'
		})
	}
	var file = uuids.pop()
	var uuid = file.replace('.hex', '')
	var hex = fs.readFileSync(path.resolve('uuids', file), 'utf8')
	fs.unlinkSync(path.resolve('uuids', file))
	res.json({
		success: true,
		message: `New UUID: ${uuid}`,
		uuid: uuid,
		hex
	})
})


// Graceful shutdown, kind of
var cleanExit = function() {
	process.exit()
}
process.on( 'SIGQUIT', cleanExit )
process.on( 'SIGHUP', cleanExit )
process.on( 'SIGINT', cleanExit ) // catch ctrl-c
process.on( 'SIGTERM', cleanExit ) // catch kill

process.on( 'exit', function() {

})
