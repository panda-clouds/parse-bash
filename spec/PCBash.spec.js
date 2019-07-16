const PCBash = require("../src/PCBash.js");

describe('PCBash.runCommandPromise', () => {

	it('should handle "pwd"', (done) => {
		const command = 'pwd'
		PCBash.runCommandPromise(command)
			.then((result)=>{
				expect(result).toBeDefined();
				expect(result[0]).toBe("/");
				done();
			})
			.catch(done.fail);
	});

	it('should handle "echo"', (done) => {
		const command = 'echo "my dog skip"'
		PCBash.runCommandPromise(command)
			.then((result)=>{
				expect(result).toBeDefined();
				expect(result).toBe("my dog skip");
				done();
			})
			.catch(done.fail);
	});

});

describe('PCBash.putStringInFile', () => {

	it('should handle numbers', (done) => {
		const path = '/tmp/spec-PCBash-putStringInFile-numbers'
		const contents = '1234567890.'
		PCBash.putStringInFile(contents,path)
			.then((result)=>{
				expect(result).toBe("");
				const command = 'cat "' + path + '"';
				return PCBash.runCommandPromise(command)
					.then((result)=>{
						expect(result).toBeDefined();
						expect(result).toBe(contents);
					})
			})
			.then(()=>{
				// clean up
				// make sure path isn't bad news
				expect(path).toContain("/tmp/")
				const command = 'rm ' + path;
				return PCBash.runCommandPromise(command)
					.then((result)=>{
						expect(result).toBeDefined();
						expect(result).toBe('');
					})
			})
			.then(()=>{
				// confirm clean up
				const command = 'cat "' + path + '"';
				return PCBash.runCommandPromise(command)
					.then(()=>{
						expect(true).toBe(false);
					})
					.catch((error)=>{
						expect(error).toContain('No such file or directory');
						done();
					});
			})
			.catch(done.fail);
	});

	it('should handle numbers with await', async () => {
		const path = '/tmp/spec-PCBash-putStringInFile-numbers-await'
		const contents = '1234567890.'
		const result = await PCBash.putStringInFile(contents,path)

		expect(result).toBe("");

		const results2 = await PCBash.runCommandPromise('cat "' + path + '"');

		expect(results2).toBeDefined();
		expect(results2).toBe(contents);

		expect(path).toContain("/tmp/")

		const results3 = await PCBash.runCommandPromise('rm ' + path);

		expect(results3).toBeDefined();
		expect(results3).toBe('');

		try {
			const results4 = await PCBash.runCommandPromise('cat "' + path + '"');
			expect(true).toBe(false);
			expect(results4).toBe('bla');
		} catch (error) {
			expect(error).toContain('No such file or directory');
		}
	});

	it('should wait await', async () => {
		const now = new Date();
		await PCBash.runCommandPromise('sleep 3');
		const after = new Date();

		expect((after.getTime() - now.getTime())).toBeGreaterThan(3000);
	});

	it('should handle EOF and new lines', (done) => {
		const path = '/tmp/spec-PCBash-putStringInFile-EOF-new-lines'
		const contents = 'EOF\nhello World\nEOF'
		PCBash.putStringInFile(contents,path)
			.then((result)=>{
				expect(result).toBe("");
				const command = 'cat "' + path + '"';
				return PCBash.runCommandPromise(command)
					.then((result)=>{
						expect(result).toBeDefined();
						expect(result).toBe(contents);
					})
			})
			.then(()=>{
				// clean up
				// make sure path isn't bad news
				expect(path).toContain("/tmp/")
				const command = 'rm ' + path;
				return PCBash.runCommandPromise(command)
					.then((result)=>{
						expect(result).toBeDefined();
						expect(result).toBe('');
					})
			})
			.then(()=>{
				// confirm clean up
				const command = 'cat "' + path + '"';
				return PCBash.runCommandPromise(command)
					.then(()=>{
						expect(true).toBe(false);
					})
					.catch((error)=>{
						expect(error).toContain('No such file or directory');
						done();
					});
			})
			.catch(done.fail);
	});


	it('should handle a js object and input as JSON', (done) => {
		const path = '/tmp/spec-PCBash-putStringInFile-EOF-new-lines'


		const contents = {}
		contents.keyString = "value";
		contents.keyNumber = 5;
		contents.keyDate = new Date();
		contents.keyNull = null;
		const array = [];
		array.push("hi");
		array.push(1);
		array.push(new Date())
		array.push(null)
		contents.arrayKey = array
		const subDic = {}
		subDic.subKeyString = "hi";
		subDic.subKeyNumber = 5;
		subDic.subKeyDate = new Date();
		subDic.subKeyNull = null;
		contents.subDic = subDic;
		const contentCheck = JSON.stringify(contents);

		PCBash.putStringInFile(contents,path)
			.then((result)=>{
				expect(result).toBe("");
				const command = 'cat "' + path + '"';
				return PCBash.runCommandPromise(command)
					.then((result)=>{
						expect(result).toBeDefined();
						expect(result).toBe(contentCheck);
					})
			})
			.then(()=>{
				// clean up
				// make sure path isn't bad news
				expect(path).toContain("/tmp/")
				const command = 'rm ' + path;
				return PCBash.runCommandPromise(command)
					.then((result)=>{
						expect(result).toBeDefined();
						expect(result).toBe('');
					})
			})
			.then(()=>{
				// confirm clean up
				const command = 'cat "' + path + '"';
				return PCBash.runCommandPromise(command)
					.then(()=>{
						expect(true).toBe(false);
					})
					.catch((error)=>{
						expect(error).toContain('No such file or directory');
						done();
					});
			})
			.catch(done.fail);
	});

});

