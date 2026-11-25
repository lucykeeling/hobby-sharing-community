class ProfileComponent {
  constructor() {
    if (new.target === ProfileComponent) {
      throw new Error('ProfileComponent is abstract and cannot be instantiated directly');
    }
  }
  build() {
    throw new Error('build() must be implemented by subclass');
  }
}
module.exports = ProfileComponent;