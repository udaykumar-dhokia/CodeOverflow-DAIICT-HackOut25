import ProjectDeveloper, { ProjectDeveloperInterface } from "../../project_developers/project_developers.model";

export type UserType = {
  name: string;
  email: string;
  password: string;
  asset_type: "plant" | "storage" | "pipeline" | "distribution_hub" | "";
};

class UserDAO {
  // Find user by id
  async findByID(id: string) {
    return await ProjectDeveloper.findById(id);
  }

  // Find user by email
  async findByEmail(email: string) {
    return await ProjectDeveloper.findOne({ email });
  }

  // Create new user
  async create(payload: UserType) {
    const user = new ProjectDeveloper({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });
    return user.save();
  }
}

export default new UserDAO();