// import { application } from "express";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const applyJob = async (req, res) => {
  try {
    console.log(req.file.buffer,"req.file.buffer.......");
    
    const userId = req.user.userId;
    const jobId = req.params.jobId;
    const  letter  = req.body.letter;
    if (!jobId) {
      return res.status(400).json({
        message: "job id required",
        success: false,
      });
    }
    if(!req.file){
      return res.status(400).json({
    message: "Resume file is required",
    success: false,
  });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({
        message: "job not found",
        success: false,
      });
    }
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "you have alerady applied for this job",
        success: false,
      });
    }
    // const folder="resume"
    const result = await uploadToCloudinary(req.file.buffer, "resume" ,req.file.mimetype);
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      letter,
      resume:{
        url:result.secure_url,
        public_id:result.public_id,
      }
    });
    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};


export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.userId;

    const applications = await Application.find({ applicant: userId }).populate({
      path:"job",
      populate:{
        path:"postedBy",select:"companyName"
      }
    });
    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobApplicantsCount = async (req, res) => {
  try {
    const companyId = req.user.userId;

    const jobs = await Job.find({
      postedBy: companyId,
    });
    if (!jobs.length) {
      return res.status(404).json({
        success: false,
        message: "no found job",
      });
    }
    const result = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        return {
          job,
          applicants: count,
        };
      }),
    );

    return res.status(200).json({
      message: "job applicant fetch successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const status  = req.body.status;
    const applicationId = req.params.id;
    const validStatus = ["pending", "accepted", "rejected"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "invalid status",
      });
    }
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { returnDocument: "after" },
    );
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkUserApplied =async (req,res) => {
  try {
    const {jobId} = req.params;
    const userId = req.user.userId;

    if(!jobId){
      return res.status(400).json({
        message:"jobId is required",
      })
    }
    const existingApplication = await Application.findOne({
      job:jobId,
      applicant:userId,
    })
    return res.status(200).json({
      applied:!!existingApplication,
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

export const getCompanyApplications =async (req,res)=>{
  try {
    const companyId =req.user.userId
    
    const jobs = await Job.find({postedBy:companyId});

    const jobId = jobs.map((job)=>job._id)

    const applications = await Application.find({job:{$in:jobId}}).populate({
      path:"job",
      select:"jobTitle location postedBy",
      populate:{
        path: "postedBy",
        select:"fullName"
      }
    })

    return res.status(200).json({
      applications,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:message.error
    })
  }
}
