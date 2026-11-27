//Concrete Decorator - adds the badges to the profile dynamically

const ProfileDecorator = require('./ProfileDecorator');

const MAX_BADGES = 5;

const BADGE_OPTIONS = [
  { name: 'Beginner', description: 'Just getting started' },
  { name: 'Enthusiast', description: 'Loves spending time on hobbies' },
  { name: 'Mentor', description: 'Happy to help others learn' },
  { name: 'Collaborator', description: 'Keen to work on shared projects' },
  { name: 'Crafter', description: 'Makes things by hand' },
  { name: 'Artist', description: 'Draws, paints or designs' },
  { name: 'Gardener', description: 'Grows plants and food' },
  { name: 'Home Cook', description: 'Enjoys cooking and baking' },
  { name: 'Photographer', description: 'Captures moments on camera' },
  { name: 'Musician', description: 'Plays or creates music' },
  { name: 'Bookworm', description: 'Always has a book on the go' },
  { name: 'Gamer', description: 'Enjoys video or tabletop games' },
  { name: 'Outdoor Explorer', description: 'Hikes, camps and explores' },
  { name: 'Fitness Fan', description: 'Stays active through sport or exercise' },
  { name: 'DIY Builder', description: 'Builds and repairs things' },
];

class BadgesDecorator extends ProfileDecorator {
  build() {
    return { ...super.build(), badges: this.user.badges };
  }
}

module.exports = BadgesDecorator;
module.exports.MAX_BADGES = MAX_BADGES;
module.exports.BADGE_OPTIONS = BADGE_OPTIONS;