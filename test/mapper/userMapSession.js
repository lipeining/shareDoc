const userMapSession = require('../../mapper')
	.userMapSession;
var should = require('should');
describe('Test user map session ', function() {
	console.log('current user map session is');
	console.log(userMapSession);
	let user1 = 'said1';
	let session1 = ['sess:www1', 'sess:www2', 'sess:www3'];
	let user2 = 'said2';
	let session2 = ['sess:mmm1', 'sess:mmm2', 'sess:mmm3'];
	it(' User Map Session keys ', async () => {
		let keys = userMapSession.keys();
		console.log(keys);
	});
	it(' User Map Session set and get user1 session1 ', async () => {
		userMapSession.set(user1, [session1[0]]);
		userMapSession.set(user2, [session2[0]]);
		let get1 = userMapSession.get(user1);
		let get2 = userMapSession.get(user2);
		for (let i = 0; i < get1.length; i++) {
			get1[i].should.equal(session1[i]);
		}
		for (let i = 0; i < get2.length; i++) {
			get2[i].should.equal(session2[i]);
		}
	});
	it(' User Map Session entries ', async () => {
		console.log(userMapSession.entries());
	});
	it(' User Map Session append user1 session1 user2 session2', async () => {
		console.log('before delete');
		console.log(userMapSession.entries());
		userMapSession.delete(user1);
		userMapSession.delete(user2);
		console.log('after delete');
		console.log(userMapSession.entries());
		for (let i = 0; i < session1.length; i++) {
			userMapSession.append(user1, session1[i]);
		}
		for (let i = 0; i < session2.length; i++) {
			userMapSession.append(user2, session2[i]);
		}
		console.log('after append');
		console.log(userMapSession.entries());
		let get1 = userMapSession.get(user1);
		let get2 = userMapSession.get(user2);
		for (let i = 0; i < get1.length; i++) {
			get1[i].should.equal(session1[i]);
		}
		for (let i = 0; i < get2.length; i++) {
			get2[i].should.equal(session2[i]);
		}
	});
	it(' User Map Session set to ingore origin session string ', async () => {
		console.log('before set');
		console.log(userMapSession.entries());
		userMapSession.set(user1, [session1[0]]);
		userMapSession.set(user2, [session2[0]]);
		console.log('after set');
		console.log(userMapSession.entries());
		let get1 = userMapSession.get(user1);
		let get2 = userMapSession.get(user2);
		for (let i = 0; i < get1.length; i++) {
			get1[i].should.equal(session1[i]);
		}
		for (let i = 0; i < get2.length; i++) {
			get2[i].should.equal(session2[i]);
		}
	});
	it(' User Map Session unshift user1 session1 user2 session2', async () => {
		console.log('before delete');
		console.log(userMapSession.entries());
		userMapSession.delete(user1);
		userMapSession.delete(user2);
		console.log('after delete');
		console.log(userMapSession.entries());
		for (let i = 0; i < session1.length; i++) {
			userMapSession.unshift(user1, session1[i]);
		}
		for (let i = 0; i < session2.length; i++) {
			userMapSession.unshift(user2, session2[i]);
		}
		console.log('after unshift');
		console.log(userMapSession.entries());
		let get1 = userMapSession.get(user1);
		let get2 = userMapSession.get(user2);
		let len1 = session1.length;
		let len2 = session2.length;
		for (let i = 0; i < get1.length; i++) {
			get1[i].should.equal(session1[len1 - i - 1]);
		}
		for (let i = 0; i < get2.length; i++) {
			get2[i].should.equal(session2[len2 - i - 1]);
		}
	});
	it(' User Map Session remove user1 session1 user2 session2', async () => {
		console.log('before delete');
		console.log(userMapSession.entries());
		userMapSession.delete(user1);
		userMapSession.delete(user2);
		console.log('after delete');
		console.log(userMapSession.entries());
		for (let i = 0; i < session1.length; i++) {
			userMapSession.append(user1, session1[i]);
		}
		for (let i = 0; i < session2.length; i++) {
			userMapSession.append(user2, session2[i]);
		}
		console.log('after append');
		console.log(userMapSession.entries());
		userMapSession.remove(user1, session1[0]);
        userMapSession.remove(user2, session2[0]);
        console.log('after remove');
		console.log(userMapSession.entries());
		let get1 = userMapSession.get(user1);
		let get2 = userMapSession.get(user2);
		for (let i = 0; i < get1.length; i++) {
			get1[i].should.equal(session1[i + 1]);
		}
		for (let i = 0; i < get2.length; i++) {
			get2[i].should.equal(session2[i + 1]);
		}
	});
});
