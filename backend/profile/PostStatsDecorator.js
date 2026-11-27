//Concrete Decorator - adds the post stats to the profile dynamically 

const ProfileDecorator = require('./ProfileDecorator');

class PostStatsDecorator extends ProfileDecorator {
    constructor (component, user, postsCount) {
        super(component, user);
        this.postsCount = postsCount;
    }
  build() {
    return { ...super.build(), postStats: { postsCount: this.postsCount } };
  }
}

module.exports = PostStatsDecorator;