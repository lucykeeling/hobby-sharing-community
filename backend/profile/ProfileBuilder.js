// Client - can wrap component in mutliple layers of decorators

const BaseProfile = require('./BaseProfile');
const BioDecorator = require('./BioDecorator');
const BadgesDecorator = require('./BadgesDecorator');
const PostStatsDecorator = require('./PostStatsDecorator');

function buildProfile(user, { isOwner = false, postsCount = 0 } = {}) {
  let profile = new BaseProfile(user, { isOwner });
  const vis = user.visibility || {};
  if (isOwner || vis.bio) profile = new BioDecorator(profile, user);
  if (isOwner || vis.badges) profile = new BadgesDecorator(profile, user);
  if (isOwner || vis.postStats) profile = new PostStatsDecorator(profile, user, postsCount);
  return profile.build();
}

module.exports = { buildProfile };