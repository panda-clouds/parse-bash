const PCBash = require('../src/PCBash.js');
const DigitalOcean = require('@panda-clouds/docker-machine-providers').DigitalOcean;

try {
	require('../apiKeys.js')();
} catch (e) {
	// It's ok if we don't load the keys from the apiKeys file
	// In CI we load directly
}

describe('test docker machine', () => {
	it('should create Digital Ocean Droplet with a name', async () => {
		expect.assertions(12);

		// creation
		const machineName = 'ubuntu-security-string-file';
		const myPoem = 'the big green EOF boat floats on the sea.\n!@#$%^&*()_+=`~-0123456789 The big blue EOF plane flys in the sky\n';
		const myPoemPath = '/root/myPoem.txt';
		const machinePlan = new DigitalOcean(machineName);

		machinePlan.accessToken(process.env.DIGITAL_OCEAN_TOKEN);
		machinePlan.ram('1Gb');
		const machine = await machinePlan.createMachine();

		// used for quicker debugging
		// this allows you to reuse a machine
		// const machine = new DigitalOcean(machineName);

		// try {
		// Checks
		const result = await machine.status();

		expect(result).toBe('Running');

		await PCBash.putStringInFileOnMachine(myPoem, myPoemPath, machineName);

		const readMyPoem = await PCBash.runInMachine('cat ' + myPoemPath, machineName);

		expect(readMyPoem).toBe(myPoem);

		const autoReadMyPoem = await PCBash.readFileOnMachine(myPoemPath, machineName);

		expect(autoReadMyPoem).toBe(myPoem);

		const results = await PCBash.stringEqualsFileOnMachine(myPoem, myPoemPath, machineName);

		expect(results).toBe(true);

		const notMyPoemResults = await PCBash.stringEqualsFileOnMachine('hi', myPoemPath, machineName);

		expect(notMyPoemResults).toBe(false);

		await PCBash.putStringInFileOnMachine('hi', myPoemPath, machineName);

		const autoReadMyPoem2 = await PCBash.readFileOnMachine(myPoemPath, machineName);

		expect(autoReadMyPoem2).toBe('hi');

		await PCBash.putStringInFileOnMachine('', myPoemPath, machineName);

		const autoReadMyPoem3 = await PCBash.readFileOnMachine(myPoemPath, machineName);

		expect(autoReadMyPoem3).toBe('');


		const removeResults = await PCBash.removeFileFromMachine(myPoemPath, machineName);

		expect(removeResults).toBe('');

		const autoReadMyPoem4 = await PCBash.readFileOnMachine(myPoemPath, machineName);

		expect(autoReadMyPoem4).toBeNull();

		// check dir
		const path = '/tmp/my-special-dir';

		await PCBash.createDirectoryIfNeeded(path, machineName);

		const lsResults = await PCBash.runInMachine('ls /tmp', machineName);

		expect(lsResults).toContain('my-special-dir');

		await PCBash.removeDirectoryFromMachine(path, machineName);

		const lsResults2 = await PCBash.run('ls /tmp');

		expect(lsResults2).not.toContain(path);

		await machine.destroy();
		const destroyed = await machine.status();

		expect(destroyed).toBe('Machine Not Found');
	}, 10 * 60 * 1000);
});
