import recruiterModel from '../model/recruiterModel';
import bcrypt from 'bcrypt';
import jwtUtil from '../util/jwtUtil';
import jobsModel from '../model/jobsModel';
import vendorModel from '../model/vendorModel';
import candidateModel from '../model/candidateModel';
import IRecruiter from '../interfaces/recruiter';
import IVendor from '../interfaces/vendor';
import ICandidate from '../interfaces/candidate';


const recruiterLogin = async (
  email: string,
  password: string
): Promise<{ recruiter: IRecruiter; token: string }> => {
  const recruiter = await recruiterModel
    .findOne({ email })
    .select('+password');

  if (!recruiter) {
    throw new Error('RECRUITER_NOT_FOUND');
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    recruiter.password
  );

  if (!isPasswordValid) {
    throw new Error('BAD_CREDENTIALS');
  }

  const token = jwtUtil.generateToken({
    recruiterId: recruiter.id,
    firstName: recruiter.firstName,
    lastName: recruiter.lastName,
    email: recruiter.email
  });

  return { recruiter, token };
};

const getAllJobsService = async () => {
  try {
    const jobs = await jobsModel.find().populate({
      path: 'vendorId',
      select: 'organizationName primaryContact logo'
    });

    const alljobs = jobs.map(job => {
      const vendor = job.vendorId as any;
      return {
        id: job.id,
        vendorId: vendor?._id || job.vendorId,
        organizationName: vendor?.organizationName || '',
        primaryContactFirstName: vendor?.primaryContact?.firstName || '',
        primaryContactLastName: vendor?.primaryContact?.lastName || '',
        logo: vendor?.logo || '',
        jobTitle: job.jobTitle,
        jobDescription: job.jobDescription,
        postStart: job.postStart,
        postEnd: job.postEnd,
        noOfPositions: job.noOfPositions,
        minimumSalary: job.minimumSalary,
        maximumSalary: job.maximumSalary,
        jobType: job.jobType,
        jobLocation: job.jobLocation,
        minimumExperience: job.minimumExperience,
        maximumExperience: job.maximumExperience,
        status: job.status,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt
      };
    });

    return {
      success: true,
      jobs: alljobs,
    };
  } catch (error) {
    throw new Error('RECRUITER_FETCH_JOBS_FAILED');
  }
};

const getJobByIdService = async (jobId: string) => {
  const job = await jobsModel.findById(jobId);
  return job;
};

const getAllClientsService = async () => {
  try {
    const clients = await vendorModel.find();

    const formattedClients = clients.map(client => ({
      id: client.id,
      organizationName: client.organizationName,
      logo: client.logo,
      email: client.email,
      status: client.status,
      emailStatus: client.emailStatus,
      mobile: client.mobile,
      mobileStatus: client.mobileStatus,
      category: client.category,
      gstin: client.gstin,
      panCard: client.panCard,
      primaryContact: client.primaryContact,
      secondaryContact: client.secondaryContact,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }));

    return {
      success: true,
      clients: formattedClients,
    };
  } catch (error) {
    throw new Error('CLIENTS_FETCH_ERROR_MESSAGE');
  }
};

const getClientByIdService = async (
  clientId: string
): Promise<IVendor | null> => {
  return vendorModel.findById(clientId);
};

const getAllCandidatesService = async () => {
  try {
    const candidates = await candidateModel.find();

    const formattedCandidates = candidates.map(candidate => ({
      id: candidate.id,
      email: candidate.email,
      firstName: candidate.firstName || '',
      lastName: candidate.lastName || '',
      mobileNumber: candidate.mobileNumber || '',
      gender: candidate.gender || '',
      dateOfBirth: candidate.dateOfBirth || '',
      address: candidate.address || '',
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    }));

    return {
      success: true,
      candidates: formattedCandidates,
    };
  } catch (error) {
    throw new Error('CANDIDATE_FETCH_FAILED');
  }
};

const getCandidateByIdService = async (
  candidateId: string
): Promise<ICandidate | null> => {
  return candidateModel.findById(candidateId);
};

export default {
  recruiterLogin,
  getAllJobsService,
  getJobByIdService,
  getAllClientsService,
  getClientByIdService,
  getAllCandidatesService,
  getCandidateByIdService,
};
