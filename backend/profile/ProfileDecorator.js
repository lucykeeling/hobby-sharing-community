// Base Decorator - delegates all operations to the wrapped component

const ProfileComponent = require('./ProfileComponent');

class ProfileDecorator extends ProfileComponent {
  constructor(component, user) {
    super();
    this.component = component;
    this.user = user;
  }
  build() {
    return this.component.build();
  }
}

module.exports = ProfileDecorator;