const PCBash = require('../src/PCBash.js');
const DigitalOcean = require('@panda-clouds/docker-machine-providers').DigitalOcean;

try {
	require('../apiKeys.js')();
} catch (e) {
	// It's ok if we don't load the keys from the apiKeys file
	// In CI we load directly
}

describe('test docker machine', () => {
	const machineName = 'ubuntu-security-string-file';
	let machine;

	beforeAll(async () => {
		const machinePlan = new DigitalOcean(machineName);

		const maybeCache = await machinePlan.status();

		if (maybeCache === 'Running') {
			// using cache
			machine = machinePlan;
		} else {
			machinePlan.accessToken(process.env.DIGITAL_OCEAN_TOKEN);
			machinePlan.ubuntuVersion(ubuntuVersion);
			machinePlan.ram('1Gb');
			machine = await machinePlan.createMachine();
			// Checks
			const result = await machine.status();

			if (result === 'Running') {
				// good to go
			} else {
				throw new Error('test machine failed to start');
			}
		}
	}, 1000 * 60 * 10);

	// afterAll(async () => {
	// 	await machine.destroy();
	// 	const destroyed = await machine.status();

	// 	expect(destroyed).toBe('Machine Not Found');
	// });

	it('should create Digital Ocean Droplet with a name', async () => {
		expect.assertions(14);

		// creation
		const myPoem = 'the big green EOF boat floats on the sea.\n!@#$%^&*()_+=`~-0123456789 The big blue EOF plane flys in the sky\n';
		const myPoemPath = '/root/myPoem.txt';
		const uniquePath = '/root/unique.txt';

		// #########  putStringInFileOnMachine & readFileOnMachine & stringEqualsFileOnMachine & removeFileFromMachine  #########
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


		await PCBash.removeFileFromMachine(myPoemPath, machineName);

		const autoReadMyPoem4 = await PCBash.readFileOnMachine(myPoemPath, machineName);

		expect(autoReadMyPoem4).toBeNull();


		// #########  createDirectoryIfNeeded & removeDirectoryFromMachine #########
		const path = '/tmp/my-special-dir';

		await PCBash.createDirectoryIfNeeded(path, machineName);

		const lsResults = await PCBash.runInMachine('ls /tmp', machineName);

		expect(lsResults).toContain('my-special-dir');

		await PCBash.removeDirectoryFromMachine(path, machineName);

		const lsResults2 = await PCBash.run('ls /tmp');

		expect(lsResults2).not.toContain(path);


		// #########  addUniqueStringToFileOnMachine & readFileOnMachine #########

		await PCBash.addUniqueStringToFileOnMachine('blip-bam', uniquePath, machineName);
		const read1 = await PCBash.readFileOnMachine(uniquePath, machineName);

		expect(read1).toBe('blip-bam');

		// should NOT add
		await PCBash.addUniqueStringToFileOnMachine('blip-bam', uniquePath, machineName);
		await PCBash.addUniqueStringToFileOnMachine('blip', uniquePath, machineName);
		await PCBash.addUniqueStringToFileOnMachine('bam', uniquePath, machineName);
		await PCBash.addUniqueStringToFileOnMachine('p-b', uniquePath, machineName);

		const read2 = await PCBash.readFileOnMachine(uniquePath, machineName);

		expect(read2).toBe('blip-bam');

		await PCBash.addUniqueStringToFileOnMachine('blip-bam-boom', uniquePath, machineName);


		const read3 = await PCBash.readFileOnMachine(uniquePath, machineName);

		expect(read3).toBe('blip-bam\nblip-bam-boom');

		await PCBash.addUniqueStringToFileOnMachine('blip-bam-boom', uniquePath, machineName);

		await PCBash.addUniqueStringToFileOnMachine('siggity-saggity-zop', uniquePath, machineName);

		const read4 = await PCBash.readFileOnMachine(uniquePath, machineName);

		expect(read4).toBe('blip-bam\nblip-bam-boom\nsiggity-saggity-zop');

		await PCBash.removeFileFromMachine(uniquePath, machineName);

		const read5 = await PCBash.readFileOnMachine(uniquePath, machineName);

		expect(read5).toBeNull();

		// await machine.destroy();
		// const destroyed = await machine.status();

		// expect(destroyed).toBe('Machine Not Found');
	}, 10 * 60 * 1000);
});
