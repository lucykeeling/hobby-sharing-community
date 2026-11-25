const ProfileComponent = require('./ProfileComponent');

class ProfileDecorator extends ProfileComponent {
  constructor(component, user) {
    super();
    if (new.target === ProfileDecorator) throw new Error('ProfileDecorator is abstract');
    this.component = component;   
    this.user = user;
  }
  build() {
    return this.component.build();   
  }
}

module.exports = ProfileDecorator;