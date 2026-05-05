const { printSummary } = require('./lib/reporter');

const runAlice = require('./personas/alice');
const runBob = require('./personas/bob');
const runCredStuffer = require('./personas/credStuffer');
const runScraper = require('./personas/scraper');
const runInjector = require('./personas/injector');
const runCardTester = require('./personas/cardTester');

console.log('🚀 Starting Realistic E-Commerce Traffic Emulator...\n');

// Start Personas
runAlice().catch(console.error); // Normal (30%)
runBob().catch(console.error);   // Power shopper (20%)
runCredStuffer().catch(console.error); // Attacker (15%)
runScraper().catch(console.error); // Attacker (15%)
runInjector().catch(console.error); // Attacker (10%)
runCardTester().catch(console.error); // Attacker (10%)

// Run summary report every 60 seconds
setInterval(printSummary, 60000);
