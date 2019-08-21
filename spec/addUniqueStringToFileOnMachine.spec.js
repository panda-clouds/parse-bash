const PCBash = require('../src/PCBash.js');

describe('test addUniqueStringToFileOnMachine', () => {
	it('should block removing machine with no parameters', async () => {
		expect.assertions(1);

		try {
			await PCBash.addUniqueStringToFileOnMachine();
		} catch (e) {
			expect(e.message).toBe('Invalid path parameter');
		}
	});

	it('should block with null path', async () => {
		expect.assertions(1);

		try {
			await PCBash.addUniqueStringToFileOnMachine(null, null);
		} catch (e) {
			expect(e.message).toBe('Invalid path parameter');
		}
	});

	it('should block with empty path', async () => {
		expect.assertions(1);

		try {
			await PCBash.addUniqueStringToFileOnMachine(null, '');
		} catch (e) {
			expect(e.message).toBe('Invalid path parameter');
		}
	});

	it('should block with null bladeId', async () => {
		expect.assertions(1);

		try {
			await PCBash.addUniqueStringToFileOnMachine(null, 'hi', null);
		} catch (e) {
			expect(e.message).toBe('Missing bladeId parameter');
		}
	});

	it('should block with empty bladeId', async () => {
		expect.assertions(1);

		try {
			await PCBash.addUniqueStringToFileOnMachine(null, 'hi', '');
		} catch (e) {
			expect(e.message).toBe('Missing bladeId parameter');
		}
	});
});
