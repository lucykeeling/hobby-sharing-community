//Tests for Epic 2 - Author profile page

const chai = require('chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const { getUserPosts } = require('../controllers/postController');
const Post = require('../models/post');
const { expect } = chai;



describe('HSC-142: Author profile page - getUserPosts', () => {

    it('should return posts for the given user', async () => {
        // Mock user ID
        const userId = new mongoose.Types.ObjectId();

        // Mock post data
        const mockPosts = [
            { _id: new mongoose.Types.ObjectId(), title: "Post 1", creator: userId },
            { _id: new mongoose.Types.ObjectId(), title: "Post 2", creator: userId }
        ];

        // Stub post.find and it's chain to return mock posts
        const chain = {
            select: sinon.stub().returnsThis(),
            sort: sinon.stub().returnsThis(),
            populate: sinon.stub().resolves(mockPosts)
        };
        const findStub = sinon.stub(Post, 'find').returns(chain);

        // Mock request & response
        const req = { user: { id: userId } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        // Call function
        await getUserPosts(req, res);

        // Assertions
        expect(findStub.calledOnceWith({ creator: userId })).to.be.true;
        expect(chain.select.calledWith('-image')).to.be.true;
        expect(chain.sort.calledWith({ createdAt: -1 })).to.be.true;
        expect(chain.populate.calledWith('creator', 'name')).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(mockPosts)).to.be.true;

    });

    it('should return 500 if the database query fails', async () => {
        const chain = {
            select: sinon.stub().returnsThis(),
            sort: sinon.stub().returnsThis(),
            populate: sinon.stub().rejects(new Error('DB error'))
        };
        sinon.stub(Post, 'find').returns(chain);


        const req = { user: { id: new mongoose.Types.ObjectId() } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        await getUserPosts(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ message: 'DB error' })).to.be.true;

    });



    // Restore stubbed methods
    afterEach(() => sinon.restore());
});



