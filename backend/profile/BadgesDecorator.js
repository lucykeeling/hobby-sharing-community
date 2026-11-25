const ProfileDecorator = require('./ProfileDecorator');

class BadgesDecorator extends ProfileDecorator {
  build() {
    return { ...super.build(), badges: this.user.badges };
  }
}

module.exports = BadgesDecorator;