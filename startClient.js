const args = [ 'start' ]
const opts = { stdio: 'inherit', cwd: 'reactApp', shell: true }
require('child_process').spawn('npm', args, opts)
