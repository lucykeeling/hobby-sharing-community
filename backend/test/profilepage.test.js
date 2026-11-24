//Tests for Epic 2 - Author profile page
const chai = require('chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const { getUserPosts, getPostsByAuthor } = require('../controllers/postController');
const { getPublicProfile } = require('../controllers/userController');
const Post = require('../models/post');
const User = require('../models/User');
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

describe('HSC-142: Author profile page - getPublicProfile', () => {
    const validId = new mongoose.Types.ObjectId().toString();
    const fakeUser = { name: 'Test Author', email: 'a@b.com', profileImage: { data: Buffer.from('x') } };
    let req, res;

    beforeEach(() => {
        req = { params: { id: validId } };
        res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    });

    it('should return public profile for a valid user ID', async () => {
        const chain = { select: sinon.stub().resolves(fakeUser) };
        sinon.stub(User, 'findById').returns(chain);

        await getPublicProfile(req, res);

        expect(User.findById.calledOnceWith(validId)).to.be.true;
        expect(chain.select.calledWith('name profileImage')).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ name: fakeUser.name, hasProfileImage: !!fakeUser.profileImage?.data })).to.be.true;
    });

    it('should return 404 for an invalid user ID', async () => {
        const invalidReq = { params: { id: 'invalid-id' } };
        const findStub = sinon.stub(User, 'findById');
        await getPublicProfile(invalidReq, res);

        expect(findStub.called).to.be.false;
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'User not found' })).to.be.true;

    });

    it('should return 404 if the user does not exist', async () => {
        sinon.stub(User, 'findById').returns({ select: sinon.stub().resolves(null) });
        await getPublicProfile(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'User not found' })).to.be.true;
    });

    it('should return 500 if the database query fails', async () => {
        const chain = {
            select: sinon.stub().rejects(new Error('DB error'))
        };
        sinon.stub(User, 'findById').returns(chain);


        await getPublicProfile(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ message: 'An unexpected error occurred while fetching the user profile' })).to.be.true;
        expect(res.json.calledWith({ message: 'DB error' })).to.be.false;

    });

    afterEach(() => sinon.restore());
});


describe('HSC-142: Author profile page - getPostsByAuthor', () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const mockPosts = [{ title: 'Post 1', creator: userId }, { title: 'Post 2', creator: userId }];
    let chain, req, res;

    beforeEach(() => {
        chain = {
            select: sinon.stub().returnsThis(),
            sort: sinon.stub().returnsThis(),
            populate: sinon.stub(),
        };
        chain.populate.onFirstCall().returnsThis();
        chain.populate.onSecondCall().resolves(mockPosts);
        req = { params: { userId } };
        res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    });

    it('should return posts for a specific user', async () => {

        sinon.stub(Post, 'find').returns(chain);


        await getPostsByAuthor(req, res);

        expect(Post.find.calledOnceWith({ creator: userId, postStatus: 'approved' })).to.be.true;
        expect(chain.select.calledWith('-image')).to.be.true;
        expect(chain.sort.calledWith({ createdAt: -1 })).to.be.true;
        expect(chain.populate.firstCall.calledWith('creator', 'name')).to.be.true;
        expect(chain.populate.secondCall.calledWith('category', 'Category_name')).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(mockPosts)).to.be.true;

    });

    it('should return 404 for an invalid user ID', async () => {
        const invalidReq = { params: { userId: 'invalid-id' } };
        const findStub = sinon.stub(Post, 'find');
        await getPostsByAuthor(invalidReq, res);

        expect(findStub.called).to.be.false;
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'User not found' })).to.be.true;

    });

    it('should return 500 if the database query fails', async () => {
        const errChain = {
            select: sinon.stub().returnsThis(),
            sort: sinon.stub().returnsThis(),
            populate: sinon.stub(),
        };
        errChain.populate.onFirstCall().returnsThis();
        errChain.populate.onSecondCall().rejects(new Error('DB error'));
        sinon.stub(Post, 'find').returns(errChain);

        await getPostsByAuthor(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ message: 'An unexpected error occurred while fetching posts' })).to.be.true;
        expect(res.json.calledWith({ message: 'DB error' })).to.be.false;
    });

    afterEach(() => sinon.restore());
});