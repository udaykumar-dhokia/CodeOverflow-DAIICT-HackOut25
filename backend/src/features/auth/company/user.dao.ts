import Company, { CompanyInterface } from "../../company/company.model"; 

export type UserType = {
  name: string;
  website: string;
  GSTIN?: string;
  about_us: string;
  company_size: number;
  location: string;
  email: string;
  contact: string;
  password: string;
  asset_type: "plant" | "storage" | "pipeline" | "distribution_hub";
  latitude: number;
  longitude: number;
};

class UserDAO {
  async findByID(id: string) {
    return await Company.findById(id);
  }

  // Find company by email
  async findByEmail(email: string) {
    return await Company.findOne({ email });
  }

  // Create new company
  async create(payload: UserType) {
    const company = new Company({
      name: payload.name,
      website: payload.website,
      GSTIN: payload.GSTIN,
      about_us: payload.about_us,
      company_size: payload.company_size,
      location: payload.location,
      email: payload.email,
      contact: payload.contact,
      password: payload.password,
      asset_type: payload.asset_type,
      latitude: payload.latitude,
      longitude: payload.longitude,
    });
    return company.save();
  }
}

export default new UserDAO();