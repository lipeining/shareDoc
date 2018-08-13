const userMapSocket = require('../../mapper')
	.userMapSocket;
var should = require('should');
describe('Test user map socket ', function() {
	console.log('current user map socket is');
	console.log(userMapSocket);
	let user1 = 'said1';
	let socket1 = {
        index: ['1index1', '1index2'],
        doc: ['1doc1', '1doc2']
    };
	let user2 = 'said2';
	let socket2 = {
        index: ['2index1', '2index2'],
        doc: ['2doc1', '2doc2']
    };
	it(' User Map socket set and get user1 socket1 ', async () => {
		await userMapSocket.set(user1, 'index', socket1['index'][0]);
		await userMapSocket.set(user2, 'index', socket2['index'][0]);
		let get1 = await userMapSocket.get(user1);
		let get2 = await userMapSocket.get(user2);
		for (let i = 0; i < get1.index.length; i++) {
			get1.index[i].should.equal(socket1.index[i]);
		}
		for (let i = 0; i < get2.index.length; i++) {
			get2.index[i].should.equal(socket2.index[i]);
		}
    });
    it(' User Map socket keys ', async () => {
		let keys = await userMapSocket.keys();
		console.log(keys);
	});
	it(' User Map socket entries ', async () => {
        let entries = await userMapSocket.entries();
		console.log(entries);
	});
	it(' User Map socket doc append user1 socket1 user2 socket2', async () => {
		console.log('before delete');
		console.log(await userMapSocket.entries());
		await userMapSocket.delete(user1);
		await userMapSocket.delete(user2);
		console.log('after delete');
		console.log(await userMapSocket.entries());
		for (let i = 0; i < socket1['doc'].length; i++) {
			await userMapSocket.append(user1, 'doc', socket1['doc'][i]);
		}
		for (let i = 0; i < socket2['doc'].length; i++) {
			await userMapSocket.append(user2, 'doc', socket2['doc'][i]);
		}
		console.log('after append');
		console.log(await userMapSocket.entries());
		let get1 = await userMapSocket.get(user1);
		let get2 = await userMapSocket.get(user2);
		for (let i = 0; i < get1['doc'].length; i++) {
			await get1['doc'][i].should.equal(socket1['doc'][i]);
		}
		for (let i = 0; i < get2['doc'].length; i++) {
			await get2['doc'][i].should.equal(socket2['doc'][i]);
		}
	});
	it(' User Map socket set to ingore origin socket string ', async () => {
		console.log('before set');
		console.log(await userMapSocket.entries());
		await userMapSocket.set(user1, 'index', socket1['index'][0]);
		await userMapSocket.set(user2, 'index', socket2['index'][0]);
		console.log('after set');
		console.log(await userMapSocket.entries());
		let get1 = await userMapSocket.get(user1);
		let get2 = await userMapSocket.get(user2);
		for (let i = 0; i < get1.index.length; i++) {
			get1.index[i].should.equal(socket1.index[i]);
		}
		for (let i = 0; i < get2.index.length; i++) {
			get2.index[i].should.equal(socket2.index[i]);
		}
	});
	it(' User Map socket remove user1 socket1 user2 socket2', async () => {
		console.log('before delete');
		console.log(await userMapSocket.entries());
		await userMapSocket.delete(user1);
		await userMapSocket.delete(user2);
		console.log('after delete');
		console.log(await userMapSocket.entries());
		for (let i = 0; i < socket1['doc'].length; i++) {
			await userMapSocket.append(user1, 'doc', socket1['doc'][i]);
		}
		for (let i = 0; i < socket2['doc'].length; i++) {
			await userMapSocket.append(user2, 'doc', socket2['doc'][i]);
		}
		console.log('after append');
		console.log(await userMapSocket.entries());
		await userMapSocket.remove(user1, socket1['doc'][0]);
        await userMapSocket.remove(user2, socket2['doc'][0]);
        console.log('after remove');
		console.log(await userMapSocket.entries());
		let get1 = await userMapSocket.get(user1);
		let get2 = await userMapSocket.get(user2);
		for (let i = 0; i < get1['doc'].length; i++) {
			get1['doc'][i].should.equal(socket1['doc'][i + 1]);
		}
		for (let i = 0; i < get2.length; i++) {
			get2['doc'][i].should.equal(socket2['doc'][i + 1]);
		}
	});
});
