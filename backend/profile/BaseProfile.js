//Concrete component - defines the basic behaiour which can be altered by decorators

const ProfileComponent = require('./ProfileComponent');

class BaseProfile extends ProfileComponent {
    constructor(user, { isOwner = false } = {}) {
        super();            
        this.user = user;
        this.isOwner = isOwner;
    }
    build() {
        const data = { name: this.user.name, hasProfileImage: !!this.user.profileImage?.data };
        if (this.isOwner) {
            data.email = this.user.email;
            data.role = this.user.role;
            data.visibility = this.user.visibility;
        }
        return data;
    }
}

module.exports = BaseProfile;