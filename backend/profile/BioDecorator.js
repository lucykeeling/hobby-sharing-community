//Concrete Decorator - adds the bio to the profile dynamically

const ProfileDecorator = require('./ProfileDecorator');

class BioDecorator extends ProfileDecorator {
  build() {
    return { ...super.build(), bio: this.user.bio };
  }
}

module.exports = BioDecorator;