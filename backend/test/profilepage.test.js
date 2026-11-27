//Tests for Epic 2 - Author profile page
const chai = require('chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const { getUserPosts, getPostsByAuthor } = require('../controllers/postController');
const { getPublicProfile, getProfile, updateUserProfile, validateBio, validateBadges } = require('../controllers/userController');
const { buildProfile } = require('../profile/ProfileBuilder');
const ProfileComponent = require('../profile/ProfileComponent');
const ProfileDecorator = require('../profile/ProfileDecorator');
const Post = require('../models/post');
const User = require('../models/User');
const { profileOwnerOnly } = require('../middleware/profileMiddleware');
const { MAX_BADGES, BADGE_OPTIONS } = require('../profile/BadgesDecorator');
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
    const fakeUser = { name: 'Test Author', email: 'a@b.com', profileImage: { data: Buffer.from('x') }, _id: new mongoose.Types.ObjectId(), visibility: { postStats: true } };
    let req, res;

    beforeEach(() => {
        req = { params: { id: validId } };
        res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    });

    it('should return public profile for a valid user ID', async () => {
        const chain = { select: sinon.stub().resolves(fakeUser) };
        sinon.stub(User, 'findById').returns(chain);
        sinon.stub(Post, 'countDocuments').resolves(2);

        await getPublicProfile(req, res);

        expect(User.findById.calledOnceWith(validId)).to.be.true;
        expect(chain.select.calledWith('-password -email')).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ name: fakeUser.name, hasProfileImage: !!fakeUser.profileImage?.data, postStats: { postsCount: 2 } })).to.be.true;
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

// Tests for Decorator pattern code
const makeUser = (visibility = { bio: true, badges: true, postStats: true }) => ({
    _id: new mongoose.Types.ObjectId(),
    name: 'Test Author',
    email: 'abc@def.com',
    role: 'Member',
    bio: 'Hello there',
    badges: [{ name: 'Early Adopter', description: 'Joined early' }],
    visibility
});

const allHidden = { bio: false, badges: false, postStats: false };


describe('HSC-143: Visible profile sections - buildProfile', () => {

    it('should include all enabled sections for a visitor', () => {
        const user = makeUser();

        const result = buildProfile(user, { isOwner: false, postsCount: 3 });

        expect(result.bio).to.equal(user.bio);
        expect(result.badges).to.deep.equal(user.badges);
        expect(result.postStats).to.deep.equal({ postsCount: 3 });
    });

    it('should leave out disabled sections for a visitor', () => {
        const result = buildProfile(makeUser(allHidden), { isOwner: false, postsCount: 3 });

        expect(result).to.not.have.any.keys('bio', 'badges', 'postStats');
    });

    it('should only leave out the section that is disabled', () => {
        const user = makeUser({ bio: false, badges: true, postStats: true });

        const result = buildProfile(user, { isOwner: false, postsCount: 3 });

        expect(result).to.not.have.property('bio');
        expect(result).to.include.keys('badges', 'postStats');
    });

    it('should not expose private fields to a visitor', () => {
        const result = buildProfile(makeUser(), { isOwner: false });

        expect(result).to.not.have.any.keys('email', 'role', 'visibility');
    });

    it('should include every section and private fields for the owner', () => {
        const user = makeUser(allHidden);

        const result = buildProfile(user, { isOwner: true, postsCount: 3 });

        expect(result).to.include.keys('bio', 'badges', 'postStats');
        expect(result.email).to.equal(user.email);
        expect(result.role).to.equal(user.role);
        expect(result.visibility).to.deep.equal(allHidden);
    });

    it('should keep empty sections so a fallback message can be shown', () => {
        const user = { ...makeUser(), bio: '', badges: [] };

        const result = buildProfile(user, { isOwner: false, postsCount: 0 });

        expect(result.bio).to.equal('');
        expect(result.badges).to.deep.equal([]);
        expect(result.postStats).to.deep.equal({ postsCount: 0 });
    });
});


describe('HSC-143: Visible profile sections - getProfile', () => {
    let fakeUser, req, res;

    beforeEach(() => {
        fakeUser = makeUser(allHidden);
        req = { user: { id: fakeUser._id.toString() } };
        res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    });

    it('should return all sections and count every post for the owner', async () => {
        sinon.stub(User, 'findById').resolves(fakeUser);
        sinon.stub(Post, 'countDocuments').resolves(4);

        await getProfile(req, res);

        expect(Post.countDocuments.calledOnceWith({ creator: fakeUser._id })).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.firstCall.args[0]).to.include.keys('bio', 'badges', 'postStats', 'visibility');
        expect(res.json.firstCall.args[0].postStats).to.deep.equal({ postsCount: 4 });
    });

    it('should return 500 if counting posts fails', async () => {
        sinon.stub(User, 'findById').resolves(fakeUser);
        sinon.stub(Post, 'countDocuments').rejects(new Error('DB error'));

        await getProfile(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ message: 'Server error', error: 'DB error' })).to.be.true;
    });

    afterEach(() => sinon.restore());
});


describe('HSC-143: Visible profile sections - getPublicProfile', () => {
    const validId = new mongoose.Types.ObjectId().toString();
    let req, res;

    beforeEach(() => {
        req = { params: { id: validId } };
        res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    });

    it('should return only enabled sections and count approved posts', async () => {
        const fakeUser = makeUser({ bio: true, badges: false, postStats: true });
        sinon.stub(User, 'findById').returns({ select: sinon.stub().resolves(fakeUser) });
        sinon.stub(Post, 'countDocuments').resolves(3);

        await getPublicProfile(req, res);

        expect(Post.countDocuments.calledOnceWith({ creator: fakeUser._id, postStatus: 'approved' })).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({
            name: fakeUser.name,
            hasProfileImage: false,
            bio: fakeUser.bio,
            postStats: { postsCount: 3 }
        })).to.be.true;
    });

    afterEach(() => sinon.restore());
});


describe('HSC-143: Visible profile sections - updateUserProfile', () => {
    let fakeUser, req, res;

    beforeEach(() => {
        fakeUser = makeUser();
        fakeUser.save = sinon.stub().resolves(fakeUser);
        req = { user: { id: fakeUser._id.toString() }, body: {} };
        res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    });

    it('should save the visibility settings', async () => {
        sinon.stub(User, 'findById').resolves(fakeUser);
        req.body.visibility = JSON.stringify(allHidden);

        await updateUserProfile(req, res);

        expect(fakeUser.visibility).to.deep.equal(allHidden);
        expect(fakeUser.save.calledOnce).to.be.true;
    });

    it('should keep the existing settings if visibility is not sent', async () => {
        sinon.stub(User, 'findById').resolves(fakeUser);
        req.body.name = 'New Name';

        await updateUserProfile(req, res);

        expect(fakeUser.visibility).to.deep.equal({ bio: true, badges: true, postStats: true });
        expect(fakeUser.save.calledOnce).to.be.true;
    });

    it('should return 500 and not save if visibility is not valid JSON', async () => {
        sinon.stub(User, 'findById').resolves(fakeUser);
        req.body.visibility = 'not-json';

        await updateUserProfile(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(fakeUser.save.called).to.be.false;
    });

    afterEach(() => sinon.restore());
});

// Validatebio & Validatebadges

const makeRes = () => ({ json: sinon.spy(), status: sinon.stub().returnsThis() });

describe('HSC-144: Edit bio and badges - validateBio', () => {

    it('should accept a valid bio', () => {
        expect(validateBio('This is a valid bio.')).to.equal('');

    });

    it('should reject a bio that is too long', () => {
        const longBio = 'a'.repeat(301);
        expect(validateBio(longBio)).to.equal('Bio must be 300 characters or less');
    });

});

describe('HSC-144: Edit bio and badges - validateBadges', () => {
    const pick = (count) => BADGE_OPTIONS.slice(0, count);

    it('should accept up to a maximum of 5 badges', () => {
        expect(validateBadges(pick(MAX_BADGES))).to.equal('');
    });
    it('should reject more than 5 badges', () => {
        expect(validateBadges(pick(MAX_BADGES + 1))).to.equal(`You can select up to ${MAX_BADGES} badges`);
    });
    it('should reject a made-up badge that is not in the options', () => {
        expect(validateBadges([{name: 'Made Up Badge'}])).to.equal('Unknown badge selected');
    });
});

describe('HSC-144: Edit bio and badges - profileOwnerOnly', () => {
    let res, next;

    beforeEach(() => {
        res = makeRes();
        next = sinon.spy();
    });

    it('should allow the owner to proceed', () => {
        profileOwnerOnly({ user: { id: 'abc' }, params: { id: 'abc' } }, res, next);

        expect(next.calledOnce).to.be.true;
    });

    it('should deny access to non-owners', () => {
        profileOwnerOnly({ user: { id: 'abc' }, params: { id: 'def' } }, res, next);

        expect(res.status.calledWith(403)).to.be.true;
        expect(next.called).to.be.false;
    });

    it('should return 401 if there is no user', () => {
        profileOwnerOnly({ user: null, params: {} }, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(next.called).to.be.false;
    });

    afterEach(() => sinon.restore());
});
