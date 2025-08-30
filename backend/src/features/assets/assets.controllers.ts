import { Request, Response } from 'express';
import DistributionHub, { DistributionHubInterface } from '../../features/assets/distribution_hub.model'
import Pipeline, { PipelineInterface } from '../../features/assets/pipeline.model'; 
import Plant, { IPlant } from '../../features/assets/plants.model'; 
import Storage, { StorageInterface } from '../../features/assets/storage.model'; 
import HttpStatus from "../../utils/httpStatus";
import { Types } from 'mongoose';

interface ProjectsResponse {
  distributionHubs: DistributionHubInterface[];
  pipelines: PipelineInterface[];
  plants: IPlant[];
  storage: StorageInterface[];
}
interface CreateDistributionHubInput {
  budget: number;
  project_name: string,
  capacity: number;
  service_radius: number;
  proximity_preference: string;
  land_requirement: number;
  project_developer_id: string;
  location?: string[];
}
interface UpdateDistributionHubInput {
  budget?: number;
  project_name?: string;
  capacity?: number;
  service_radius?: number;
  proximity_preference?: string;
  land_requirement?: number;
  project_developer_id?: string;
  location?: string[];
  report?: string;
}
interface CreatePipelineInput {
  budget: number;
  project_name: string;
  capacity: number;
  length_estimate: number;
  route_preference: string;
  project_developer_id: string;
  location?: string[];
}
interface UpdatePipelineInput {
  budget?: number;
  project_name?: string;
  capacity?: number;
  length_estimate?: number;
  route_preference?: string;
  project_developer_id?: string;
  location?: string[];
  report?: string;
}
interface CreatePlantInput {
  budget: number;
  project_name: string;
  capacity: number;
  preferred_source: string;
  logistic_preference: string;
  project_developer_id: string;
  location?: string[];
}
interface UpdatePlantInput {
  budget?: number;
  project_name?: string;
  capacity?: number;
  preferred_source?: string;
  logistic_preference?: string;
  project_developer_id?: string;
  location?: string[];
  report?: string;
}
interface CreateStorageInput {
  budget: number;
  project_name: string;
  capacity: number;
  technology?: string;
  proximity_preference: string;
  project_developer_id: string;
  location?: string[];
}
interface UpdateStorageInput {
  budget?: number;
  project_name?: string;
  capacity?: number;
  technology?: string;
  proximity_preference?: string;
  project_developer_id?: string;
  location?: string[];
  report?: string;
}
export const createPipeline = async (req: Request, res: Response) => {
  try {
    const {
      project_name,  
      budget,
      capacity,
      length_estimate,
      route_preference,
      project_developer_id,
      location
    }: CreatePipelineInput = req.body;
    if (!project_name || !budget || !capacity || !length_estimate || !route_preference || !project_developer_id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'All required fields must be provided'
      });
    }
    if (!Types.ObjectId.isValid(project_developer_id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid project_developer_id format'
      });
    }
    const checkExisting = await Pipeline.findOne({ project_name, project_developer_id });
    if (checkExisting) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Pipeline with the same project name and developer ID already exists'
      });
    }
    const newPipeline: PipelineInterface = await Pipeline.create({
      project_name,
      budget,
      capacity,
      length_estimate,
      route_preference,
      project_developer_id,
      location: location || []
    });
    return res.status(HttpStatus.CREATED).json({
      message: 'Pipeline created successfully',
      data: newPipeline
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error creating pipeline',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updatePipeline = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdatePipelineInput = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid pipeline ID'
      });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'No update data provided'
      });
    }

    if (updateData.project_developer_id && !Types.ObjectId.isValid(updateData.project_developer_id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid project_developer_id format'
      });
    }
    const updatedPipeline = await Pipeline.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedPipeline) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Pipeline not found'
      });
    }

    return res.status(HttpStatus.OK).json({
      message: 'Pipeline updated successfully',
      data: updatedPipeline
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error updating pipeline',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
export const DeletePipeline = async(req: Request, res: Response) => {
 try{
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid pipeline ID'
      });
    }
    const deletedPipeline = await Pipeline.findByIdAndDelete(id);
    if (!deletedPipeline) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Pipeline not found'
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Pipeline deleted successfully',
      data: deletedPipeline
    });
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error deleting pipeline',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}
export const createDistributionHub = async (req: Request, res: Response) => {
  try {
    const {
      project_name,
      budget,
      capacity,
      service_radius,
      proximity_preference,
      land_requirement,
      project_developer_id,
      location
    }: CreateDistributionHubInput = req.body;
    if (!project_name || !budget || !capacity || !service_radius || !proximity_preference || !land_requirement || !project_developer_id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'All required fields must be provided'
      });
    }
    if (!Types.ObjectId.isValid(project_developer_id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid project_developer_id format'
      });
    }
    const checkExisting = await DistributionHub.findOne({ project_name, project_developer_id });
    if (checkExisting) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Distribution hub with the same project name and developer ID already exists'
      });
    }
    const newHub: DistributionHubInterface = await DistributionHub.create({
      project_name,
      budget,
      capacity,
      service_radius,
      proximity_preference,
      land_requirement,
      project_developer_id,
      location: location || []
    });
    return res.status(HttpStatus.CREATED).json({
      message: 'Distribution hub created successfully',
      data: newHub
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error creating distribution hub',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateDistributionHub = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateDistributionHubInput = req.body;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid distribution hub ID'
      });
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'No update data provided'
      });
    }
    if (updateData.project_developer_id && !Types.ObjectId.isValid(updateData.project_developer_id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid project_developer_id format'
      });
    }
    const updatedHub = await DistributionHub.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedHub) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Distribution hub not found'
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Distribution hub updated successfully',
      data: updatedHub
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error updating distribution hub',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const DeleteDistributionHub = async(req: Request, res: Response) => {
 try{
   const { id } = req.params;
   if (!Types.ObjectId.isValid(id)) {
     return res.status(HttpStatus.BAD_REQUEST).json({
       message: 'Invalid distribution hub ID'
     });
   }
   const deletedHub = await DistributionHub.findByIdAndDelete(id);
   if (!deletedHub) {
     return res.status(HttpStatus.NOT_FOUND).json({
       message: 'Distribution hub not found'
     });
   }
   return res.status(HttpStatus.OK).json({
     message: 'Distribution hub deleted successfully',
     data: deletedHub
   });
 } catch(err){
   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
     message: 'Error deleting distribution hub',
     error: err instanceof Error ? err.message : 'Unknown error'
   });
 }
}
export const createPlant = async (req: Request, res: Response) => {
  try {
    const {
      project_name,
      budget,
      capacity,
      preferred_source,
      logistic_preference,
      project_developer_id,
      location
    }: CreatePlantInput = req.body;

    if (!project_name || !budget || !capacity || !preferred_source || !logistic_preference || !project_developer_id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'All required fields must be provided'
      });
    }
    if (!Types.ObjectId.isValid(project_developer_id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid project_developer_id format'
      });
    }
    const validLogisticPreferences = ['port', 'demand', 'pipeline', 'plant'];
    if (!validLogisticPreferences.includes(logistic_preference)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid logistic_preference value'
      });
    }
    const checkExisting = await Plant.findOne({ project_name, project_developer_id });
    if (checkExisting) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Plant with the same project name and developer ID already exists'
      });
    }
    const newPlant: IPlant = await Plant.create({
      project_name,  
      budget,
      capacity,
      preferred_source,
      logistic_preference,
      project_developer_id,
      location: location || []
    });
    return res.status(HttpStatus.CREATED).json({
      message: 'Plant created successfully',
      data: newPlant
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error creating plant',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updatePlant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdatePlantInput = req.body;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid plant ID'
      });
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'No update data provided'
      });
    }
    if (updateData.project_developer_id && !Types.ObjectId.isValid(updateData.project_developer_id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid project_developer_id format'
      });
    }
    if (updateData.logistic_preference) {
      const validLogisticPreferences = ['port', 'demand', 'pipeline', 'plant'];
      if (!validLogisticPreferences.includes(updateData.logistic_preference)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid logistic_preference value'
        });
      }
    }
    const updatedPlant = await Plant.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedPlant) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Plant not found'
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Plant updated successfully',
      data: updatedPlant
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error updating plant',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
export const DeletePlant = async(req: Request, res: Response) => {
 try{
   const { id } = req.params;
   if (!Types.ObjectId.isValid(id)) {
     return res.status(HttpStatus.BAD_REQUEST).json({
       message: 'Invalid plant ID'
     });
   }
   const deletedPlant = await Plant.findByIdAndDelete(id);
   if (!deletedPlant) {
     return res.status(HttpStatus.NOT_FOUND).json({
       message: 'Plant not found'
     });
   }
   return res.status(HttpStatus.OK).json({
     message: 'Plant deleted successfully',
     data: deletedPlant
   });
 } catch(err){
   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
     message: 'Error deleting plant',
     error: err instanceof Error ? err.message : 'Unknown error'
   });
 }
}
export const createStorage = async (req: Request, res: Response) => {
  try {
    const {
      project_name,  
      budget,
      capacity,
      technology,
      proximity_preference,
      project_developer_id,
      location
    }: CreateStorageInput = req.body;
    if (!project_name || !budget || !capacity || !proximity_preference || !project_developer_id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'All required fields must be provided'
      });
    }
    if (!Types.ObjectId.isValid(project_developer_id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid project_developer_id format'
      });
    }
    const validProximityPreferences = ['plant', 'demand', 'port'];
    if (!validProximityPreferences.includes(proximity_preference)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid proximity_preference value'
      });
    }
    const checkExisting = await Storage.findOne({ project_name, project_developer_id });
    if (checkExisting) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Storage with the same project name and developer ID already exists'
      });
    }
    const newStorage: StorageInterface = await Storage.create({
      project_name,  
      budget,
      capacity,
      technology: technology || '',
      proximity_preference,
      project_developer_id,
      location: location || []
    });

    return res.status(HttpStatus.CREATED).json({
      message: 'Storage created successfully',
      data: newStorage
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error creating storage',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateStorage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateStorageInput = req.body;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid storage ID'
      });
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'No update data provided'
      });
    }
    if (updateData.project_developer_id && !Types.ObjectId.isValid(updateData.project_developer_id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid project_developer_id format'
      });
    }
    if (updateData.proximity_preference) {
      const validProximityPreferences = ['plant', 'demand', 'port'];
      if (!validProximityPreferences.includes(updateData.proximity_preference)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid proximity_preference value'
        });
      }
    }
    const updatedStorage = await Storage.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedStorage) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Storage not found'
      });
    }
    return res.status(HttpStatus.OK).json({
      message: 'Storage updated successfully',
      data: updatedStorage
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error updating storage',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
export const DeleteStorage = async (req:Request,res: Response)=>{
    try{
       const { id } = req.params;
       if (!Types.ObjectId.isValid(id)) {
         return res.status(HttpStatus.BAD_REQUEST).json({
           message: 'Invalid storage ID'
         });
       }
       const deletedStorage = await Storage.findByIdAndDelete(id);
       if (!deletedStorage) {
         return res.status(HttpStatus.NOT_FOUND).json({
           message: 'Storage not found'
         });
       }
       return res.status(HttpStatus.OK).json({
         message: 'Storage deleted successfully',
         data: deletedStorage
       });
    }
    catch(err){
    console.log('error ',err)
    }
}
export const getAllProjectsByDeveloper = async (req: Request, res: Response) => {
  try {
    const { project_developer_id  } = req.params;
    console.log('Fetching projects for developer:', project_developer_id);
    if (!Types.ObjectId.isValid(project_developer_id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid project_developer_id format'
      });
    }
    const [distributionHubs, pipelines, plants, storage] = await Promise.all([
      DistributionHub.find({ project_developer_id }).lean(),
      Pipeline.find({ project_developer_id }).lean(),
      Plant.find({ project_developer_id }).lean(),
      Storage.find({ project_developer_id }).lean()
    ]);
    const response: ProjectsResponse = {
      distributionHubs,
      pipelines,
      plants,
      storage
    };

    return res.status(HttpStatus.OK).json({
      message: 'Projects fetched successfully',
      data: response
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching projects',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};