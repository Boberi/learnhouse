#!/usr/bin/env node

/**
 * Starts the Next.js standalone server on the landing port.
 * PORT is reserved for the main web app (8000), so landing uses LANDING_PORT.
 */
process.env.PORT = process.env.LANDING_PORT || '8010'
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0'

require('./server.js')
