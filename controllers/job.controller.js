import { Job } from "../models/job.model.js";

export const createJob = async (req, res) => {
  console.log(req?.user, "--------req user");

  try {
    const allowedFields = [
      "jobTitle",
      "jobCategory",
      "jobType",
      "location",
      "description",
      "numberOpening",
      "requirements",
      "responsibilities",
      "qualification",
      "ExperienceLevel",
      "EducationRequirement",
      "skills",
      "MinimumSalary",
      "MaximumSalary",
      "currency",
      "perks",
      "workSchedule",
      "applyMethod",
      "contactEmail",
      "deadline",
      "isFeatured",
      "visibility",
    ];
    const jobData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        jobData[field] = req.body[field];
      }
    });
    if (jobData.skills && typeof jobData.skills === "string") {
      jobData.skills = jobData.skills.split(",").map((skill) => skill.trim());
    }
    if (jobData.visibility !== undefined) {
      jobData.visibility =
        jobData.visibility === true || jobData.visibility === "true";
    }
    if(jobData.isFeatured){
      jobData.isFeatured=jobData.isFeatured===true||jobData.isFeatured==="true";
    } else{
      jobData.isFeatured=false;
    }
    jobData.postedBy = req.user?.userId;
    const newJob = await Job.create(jobData);
    return res.status(200).json({
      success: true,
      message: "Job created successfully",
      data: newJob,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
      success: false,
    });
  }
};

export const getAllJob = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      visibility: true,
      $or: [
        { jobTitle: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ],
    };
    const job = await Job.find(query)
      .populate("postedBy", "companyName profile")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: job.length,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate(
      "postedBy",
      "fullName email companyName",
    );
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "job not found",
        // job,
      });
    }
    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobs = await Job.find({
      postedBy: userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateJobVisibility =async(req,res)=>{
  try {
    const {id}=req.params
    const {visibility}=req.body;

    const job = await Job.findByIdAndUpdate(id,{visibility},{returnDocument: "after"})
    return res.status(200).json({
      success:true,
      job,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "visibility update failed"
    });
  }
}
